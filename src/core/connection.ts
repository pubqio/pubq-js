import { AuthEvents, ConnectionEvents } from "types/event.type";
import { EventEmitter } from "./event-emitter";
import { OptionManager } from "./option-manager";
import { WebSocketClient } from "./websocket-client";
import { PubQWebSocket } from "interfaces/websocket.interface";
import { IncomingMessage } from "interfaces/message.interface";
import { ConnectionActions } from "types/action.type";
import { AuthManager } from "./auth-manager";

class Connection extends EventEmitter {
    private static instances: Map<string, Connection> = new Map();
    private instanceId: string;
    private optionManager: OptionManager;
    private authManager: AuthManager;
    private wsClient: WebSocketClient;
    private socket: PubQWebSocket | null = null;
    private reconnectAttempts: number = 0;
    private reconnectTimeout?: NodeJS.Timeout;
    private isReconnecting: boolean = false;
    private pingTimeout?: NodeJS.Timeout;

    private constructor(instanceId: string) {
        super();
        this.instanceId = instanceId;
        this.optionManager = OptionManager.getInstance(this.instanceId);
        this.authManager = AuthManager.getInstance(this.instanceId);
        this.wsClient = WebSocketClient.getInstance(this.instanceId);

        this.authManager.on(
            AuthEvents.TOKEN_EXPIRED,
            this.handleTokenExpired.bind(this)
        );
        this.authManager.on(
            AuthEvents.TOKEN_ERROR,
            this.handleAuthError.bind(this)
        );
        this.authManager.on(
            AuthEvents.AUTH_ERROR,
            this.handleAuthError.bind(this)
        );

        this.emit(ConnectionEvents.INITIALIZED);
    }

    public static getInstance(instanceId: string): Connection {
        if (!Connection.instances.has(instanceId)) {
            Connection.instances.set(instanceId, new Connection(instanceId));
        }
        return Connection.instances.get(instanceId)!;
    }

    private setupPingHandler(): void {
        if (!this.socket) return;

        const PING_TIMEOUT =
            this.optionManager.getOption("pingTimeoutMs") || 60000; // Default 60s

        // Handle pong messages to reset the ping timer
        this.socket.onping = () => {
            console.log("ping");
            // Reset the ping timeout
            if (this.pingTimeout) clearTimeout(this.pingTimeout);

            this.pingTimeout = setTimeout(() => {
                this.handleConnectionInterrupted();
            }, PING_TIMEOUT);
        };

        // Automatically send pong responses
        this.socket.onpong = () => {
            console.log("pong");
            // Optional: can be used for connection quality monitoring
        };
    }

    private handleConnectionInterrupted(): void {
        if (this.pingTimeout) {
            clearTimeout(this.pingTimeout);
            this.pingTimeout = undefined;
        }
        this.disconnect();
        this.handleConnectionClosed(); // This will trigger reconnection if enabled
    }

    private async handleConnectionClosed() {
        // Don't attempt reconnection if we're already disconnecting
        if (this.socket?.readyState === WebSocket.CLOSING) return;

        if (this.optionManager.getOption("autoReconnect")) {
            await this.attemptReconnection();
        }
    }

    private calculateReconnectDelay(): number {
        const initial = this.optionManager.getOption("initialReconnectDelay")!;
        const max = this.optionManager.getOption("maxReconnectDelay")!;
        const multiplier = this.optionManager.getOption(
            "reconnectBackoffMultiplier"
        )!;

        const delay = initial * Math.pow(multiplier, this.reconnectAttempts);
        return Math.min(delay, max);
    }

    private async attemptReconnection() {
        if (this.isReconnecting) return;

        const maxAttempts = this.optionManager.getOption(
            "maxReconnectAttempts"
        )!;

        this.isReconnecting = true;

        while (this.reconnectAttempts < maxAttempts) {
            try {
                const delay = this.calculateReconnectDelay();

                this.emit(ConnectionEvents.CONNECTING, {
                    isReconnection: true,
                    attempt: this.reconnectAttempts + 1,
                    maxAttempts,
                    delay,
                });

                await new Promise((resolve) => setTimeout(resolve, delay));

                await this.connect();

                // Connection successful
                this.reconnectAttempts = 0;
                this.isReconnecting = false;
                return;
            } catch (error) {
                this.reconnectAttempts++;

                if (this.reconnectAttempts >= maxAttempts) {
                    this.emit(ConnectionEvents.FAILED, {
                        error,
                        context: "reconnection",
                        attempt: this.reconnectAttempts,
                        maxAttempts,
                    });
                    this.isReconnecting = false;
                    break;
                }
            }
        }
    }

    private async handleTokenExpired() {
        await this.connect();
    }

    private handleAuthError(error: Error) {
        this.emit(ConnectionEvents.FAILED, error);
        this.disconnect();
    }

    private getAuthenticatedWsUrl(): string {
        const secure = this.optionManager.getOption("isSecure");
        const host = this.optionManager.getOption("wsHost");
        const port = this.optionManager.getOption("wsPort");

        const protocol = secure ? "wss" : "ws";
        const baseUrl = `${protocol}://${host}${port ? `:${port}` : ""}/v1/`;

        return this.authManager.getAuthenticateUrl(baseUrl);
    }

    public async connect(): Promise<void> {
        try {
            this.emit(ConnectionEvents.CONNECTING);

            if (this.authManager.shouldAutoAuthenticate()) {
                await this.authManager.authenticate();
            }

            const wsUrl = this.getAuthenticatedWsUrl();
            this.wsClient.connect(wsUrl);

            this.socket = this.wsClient.getSocket();
            if (this.socket) {
                this.setupSocketListeners();
            }
        } catch (error) {
            this.handleAuthError(error as Error);
        }
    }

    private setupSocketListeners(): void {
        if (!this.socket) return;

        this.socket.onopen = () => {
            this.reconnectAttempts = 0;
            this.isReconnecting = false;
            this.emit(ConnectionEvents.OPENED);
            this.setupPingHandler();
        };

        this.socket.onclose = (event: CloseEvent) => {
            if (this.pingTimeout) {
                clearTimeout(this.pingTimeout);
                this.pingTimeout = undefined;
            }

            this.emit(ConnectionEvents.CLOSED);

            // Only attempt reconnection if it wasn't an intentional close
            if (
                !this.isReconnecting &&
                this.optionManager.getOption("autoReconnect")
            ) {
                this.handleConnectionClosed();
            }
        };

        this.socket.onerror = (event: Event) => {
            // Emit the error but don't disconnect - let onclose handle it
            this.emit(ConnectionEvents.FAILED, event);
        };

        this.socket.onmessage = (event: MessageEvent) => {
            try {
                const message: IncomingMessage = JSON.parse(event.data);
                if (message.action === ConnectionActions.CONNECTED) {
                    this.emit(ConnectionEvents.CONNECTED, message);
                } else if (message.action === ConnectionActions.DISCONNECTED) {
                    this.emit(ConnectionEvents.DISCONNECTED);
                }
            } catch (error) {
                this.emit(ConnectionEvents.FAILED, error);
            }
        };
    }

    public isConnected(): boolean {
        return this.wsClient.isConnected();
    }

    public disconnect(): void {
        this.isReconnecting = false; // Prevent reconnection attempts
        if (this.pingTimeout) {
            clearTimeout(this.pingTimeout);
            this.pingTimeout = undefined;
        }
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        this.emit(ConnectionEvents.CLOSING);
        this.wsClient.disconnect();
        this.emit(ConnectionEvents.CLOSED);
    }

    public reset(): void {
        this.disconnect();
        this.reconnectAttempts = 0;
        this.wsClient.reset();

        this.removeAllListeners();
        Connection.instances.delete(this.instanceId);
    }
}

export { Connection };

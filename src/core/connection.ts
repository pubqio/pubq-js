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
        const baseUrl = `${protocol}://${host}${port ? `:${port}` : ""}`;

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
            this.emit(ConnectionEvents.CONNECTED);
        };

        this.socket.onclose = () => {
            this.emit(ConnectionEvents.CLOSED);
        };

        this.socket.onerror = (event: Event) => {
            this.emit(ConnectionEvents.FAILED, event);
        };

        this.socket.onmessage = (event: MessageEvent) => {
            try {
                const message: IncomingMessage = JSON.parse(event.data);
                if (message.action === ConnectionActions.CONNECTED) {
                    this.emit(ConnectionEvents.CONNECTED, message.data);
                } else if (message.action === ConnectionActions.DISCONNECTED) {
                    this.emit(ConnectionEvents.DISCONNECTED);
                }
            } catch (error) {
                this.emit(ConnectionEvents.FAILED, error);
            }
        };
    }

    public disconnect(): void {
        this.emit(ConnectionEvents.CLOSING);
        this.wsClient.disconnect();
        this.emit(ConnectionEvents.CLOSED);
    }

    public reset(): void {
        if (this.socket) {
            this.emit(ConnectionEvents.CLOSING);
        }

        this.wsClient.reset();
        this.emit(ConnectionEvents.CLOSED);

        this.removeAllListeners();
        Connection.instances.delete(this.instanceId);
    }
}

export { Connection };

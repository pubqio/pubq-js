import { PubQWebSocket } from "interfaces/websocket.interface";

class WebSocketClient {
    private static instances: Map<string, WebSocketClient> = new Map();
    private instanceId: string;
    private socket: PubQWebSocket | null = null;
    private WebSocketImplementation: any;

    private constructor(instanceId: string) {
        this.instanceId = instanceId;
        if (typeof window !== "undefined" && window.WebSocket) {
            this.WebSocketImplementation = window.WebSocket;
        } else {
            try {
                this.WebSocketImplementation = require("ws");
            } catch (e) {
                throw new Error(
                    "WebSocket is not supported in this environment"
                );
            }
        }
    }

    public static getInstance(instanceId: string): WebSocketClient {
        if (!WebSocketClient.instances.has(instanceId)) {
            WebSocketClient.instances.set(
                instanceId,
                new WebSocketClient(instanceId)
            );
        }
        return WebSocketClient.instances.get(instanceId)!;
    }

    public getSocket(): PubQWebSocket | null {
        return this.socket;
    }

    public connect(url: string): void {
        if (this.socket) {
            // If there's an existing socket, close it first
            this.disconnect();
        }

        this.socket = new this.WebSocketImplementation(url) as PubQWebSocket;

        // Error handler at WebSocketClient level
        this.socket.onerror = (error: Event) => {
            console.error("WebSocket error:", error);
            // Don't disconnect here - let the Connection class handle it
        };
    }

    public isConnected(): boolean {
        return (
            this.socket !== null && this.socket.readyState === WebSocket.OPEN
        );
    }

    public disconnect(): void {
        if (this.socket) {
            if (this.socket.readyState < WebSocket.CLOSING) {
                try {
                    this.socket.close();
                } catch (error) {
                    console.error("Error closing socket:", error);
                }
            }
            this.socket = null;
        }
    }

    public send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            throw new Error("WebSocket is not connected");
        }
        this.socket.send(data);
    }

    public reset(): void {
        WebSocketClient.instances.delete(this.instanceId);
    }
}

export { WebSocketClient };

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
        if (!this.socket) {
            this.socket = new this.WebSocketImplementation(
                url
            ) as PubQWebSocket;
        }
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    public send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
        if (this.socket) {
            this.socket.send(data);
        }
    }

    public reset(): void {
        this.disconnect();
        WebSocketClient.instances.delete(this.instanceId);
    }
}

export { WebSocketClient };

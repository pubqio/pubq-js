import WebSocket from "ws";

class WebSocketClient {
    private static instance: WebSocketClient | null = null;
    private ws: WebSocket | null = null;

    private constructor() {}

    public static getInstance(): WebSocketClient {
        if (!WebSocketClient.instance) {
            WebSocketClient.instance = new WebSocketClient();
        }
        return WebSocketClient.instance;
    }

    public connect(url: string): void {
        if (!this.ws) {
            this.ws = new WebSocket(url);
        }
    }

    public disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

export { WebSocketClient };

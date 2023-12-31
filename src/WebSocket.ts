const scc = require("socketcluster-client");

class WebSocket {
    private static instance: WebSocket;

    public socket = scc;

    private constructor() {}

    public static getInstance(): WebSocket {
        if (!this.instance) {
            this.instance = new WebSocket();
        }
        return this.instance;
    }
}

export { WebSocket };

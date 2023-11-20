const scc = require("socketcluster-client");

class WebSocket {
    private client;

    constructor() {
        this.client = scc;
    }

    getClient() {
        return this.client;
    }
}

export { WebSocket };

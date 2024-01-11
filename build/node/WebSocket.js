const scc = require("socketcluster-client");
class WebSocket {
    static instance;
    socket;
    constructor(sccOptions) {
        sccOptions.autoConnect = false;
        this.socket = scc.create(sccOptions);
    }
    static getInstance(sccOptions) {
        if (!this.instance && sccOptions) {
            sccOptions.autoConnect = false;
            this.instance = new WebSocket(sccOptions);
        }
        return this.instance;
    }
    getSocket() {
        return this.socket;
    }
}
export { WebSocket };

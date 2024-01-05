import { CommonOptions } from "./types/CommonOptions";

const scc = require("socketcluster-client");

class WebSocket {
    private static instance: WebSocket;

    public socket: any;

    private constructor(sccOptions: CommonOptions) {
        sccOptions.autoConnect = false;

        this.socket = scc.create(sccOptions);
    }

    public static getInstance(sccOptions?: CommonOptions): WebSocket {
        if (!this.instance && sccOptions) {
            sccOptions.autoConnect = false;
            this.instance = new WebSocket(sccOptions);
        }
        return this.instance;
    }

    getSocket(): WebSocket | null {
        return this.socket;
    }
}

export { WebSocket };

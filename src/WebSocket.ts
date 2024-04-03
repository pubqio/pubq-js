import { OptionsManager } from "./OptionsManager";
import { CommonOptions } from "./types/CommonOptions";

const scc = require("socketcluster-client");

class WebSocket {
    private static instance: WebSocket | null = null;

    public socket: any;

    private constructor() {
        const sccOptions: CommonOptions = OptionsManager.getInstance().get();
        sccOptions.autoConnect = false;

        this.socket = scc.create(sccOptions);
    }

    public static getInstance(): WebSocket {
        if (!this.instance) {
            this.instance = new WebSocket();
        }
        return this.instance;
    }

    getSocket(): WebSocket | null {
        return this.socket;
    }

    public destroy(): void {
        if (WebSocket.instance) {
            this.socket.disconnect();
            this.socket.killAllListeners();
            this.socket.killAllReceivers();
            this.socket.deauthenticate();
            WebSocket.instance = null;
        }
    }
}

export { WebSocket };

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocket = void 0;
const OptionsManager_1 = require("./OptionsManager");
const scc = require("socketcluster-client");
class WebSocket {
    static instance = null;
    socket;
    constructor() {
        const sccOptions = OptionsManager_1.OptionsManager.getInstance().get();
        sccOptions.autoConnect = false;
        this.socket = scc.create(sccOptions);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new WebSocket();
        }
        return this.instance;
    }
    getSocket() {
        return this.socket;
    }
    destroy() {
        if (WebSocket.instance) {
            this.socket.disconnect();
            this.socket.killAllListeners();
            this.socket.killAllReceivers();
            this.socket.deauthenticate();
            WebSocket.instance = null;
        }
    }
}
exports.WebSocket = WebSocket;

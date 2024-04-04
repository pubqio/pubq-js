"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocket = void 0;
var OptionsManager_1 = require("./OptionsManager");
var scc = require("socketcluster-client");
var WebSocket = /** @class */ (function () {
    function WebSocket() {
        var sccOptions = OptionsManager_1.OptionsManager.getInstance().get();
        sccOptions.autoConnect = false;
        this.socket = scc.create(sccOptions);
    }
    WebSocket.getInstance = function () {
        if (!this.instance) {
            this.instance = new WebSocket();
        }
        return this.instance;
    };
    WebSocket.prototype.getSocket = function () {
        return this.socket;
    };
    WebSocket.prototype.destroy = function () {
        if (WebSocket.instance) {
            this.socket.disconnect();
            this.socket.killAllListeners();
            this.socket.killAllReceivers();
            this.socket.deauthenticate();
            WebSocket.instance = null;
        }
    };
    WebSocket.instance = null;
    return WebSocket;
}());
exports.WebSocket = WebSocket;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const App_1 = require("./App");
const DefaultConnectionEvents_1 = require("./defaults/DefaultConnectionEvents");
const WebSocket_1 = require("./WebSocket");
const ConnectionManager_1 = require("./ConnectionManager");
const Auth_1 = require("./Auth");
const OptionsManager_1 = require("./OptionsManager");
var EventEmitter = require("eventemitter3");
class Connection {
    options;
    ws;
    app;
    auth;
    events = new EventEmitter();
    manager = new ConnectionManager_1.ConnectionManager();
    constructor() {
        this.options = OptionsManager_1.OptionsManager.getInstance().get();
        this.ws = WebSocket_1.WebSocket.getInstance();
        this.app = App_1.App.getInstance();
        this.auth = Auth_1.Auth.getInstance();
        if (this.options.autoConnect) {
            this.connect();
        }
    }
    get state() {
        return this.manager.currentState;
    }
    get id() {
        const socket = this.ws.getSocket();
        return socket.id;
    }
    async connect() {
        const socket = this.ws.getSocket();
        if (socket) {
            await socket.connect();
            this.handleConnectingEvent()
                .then(() => this.handleConnectEvent())
                .then(() => this.handleAuthenticateEvent());
            this.handleDeauthenticateEvent();
            this.handleCloseEvent();
            this.handleErrorEvent();
        }
    }
    handleConnectingEvent() {
        return new Promise((resolve) => {
            this.events.emit("connecting", this.manager.stateChangeObject("connecting"));
            resolve();
        });
    }
    async handleConnectEvent() {
        const socket = this.ws.getSocket();
        return new Promise(async (resolve) => {
            for await (let event of socket.listener("connect")) {
                if (event.isAuthenticated) {
                    this.events.emit("connected", this.manager.stateChangeObject("connected"));
                }
                else if (this.options.autoAuthenticate &&
                    !event.isAuthenticated) {
                    this.auth.authenticate();
                }
                resolve();
            }
        });
    }
    async handleAuthenticateEvent() {
        const socket = this.ws.getSocket();
        return new Promise(async (resolve) => {
            for await (let event of socket.listener("authenticate")) {
                this.events.emit("connected", this.manager.stateChangeObject("connected"));
                resolve();
            }
        });
    }
    async handleDeauthenticateEvent() {
        const socket = this.ws.getSocket();
        return new Promise(async (resolve) => {
            for await (let event of socket.listener("deauthenticate")) {
                if (this.options.autoAuthenticate) {
                    this.auth.authenticate();
                }
                resolve();
            }
        });
    }
    async handleCloseEvent() {
        const socket = this.ws.getSocket();
        return new Promise(async (resolve) => {
            for await (let event of socket.listener("close")) {
                this.events.emit("closed", this.manager.stateChangeObject("closed"));
                socket.closeAllListeners();
                resolve();
            }
        });
    }
    async handleErrorEvent() {
        const socket = this.ws.getSocket();
        return new Promise(async (resolve) => {
            for await (let error of socket.listener("error")) {
                this.events.emit("failed", this.manager.stateChangeObject("failed", "failed", error));
                resolve();
            }
        });
    }
    close() {
        const socket = this.ws.getSocket();
        this.events.emit("closing", this.manager.stateChangeObject("closing"));
        socket.disconnect();
    }
    // Implementation of the on method
    on(arg1, arg2) {
        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
            this.events.on(arg1, arg2);
        }
        else if (Array.isArray(arg1) && typeof arg2 === "function") {
            // Overload 2
            arg1.forEach((eventName) => {
                this.events.on(eventName, arg2);
            });
        }
        else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 3
            DefaultConnectionEvents_1.DefaultConnectionEvents.forEach((eventName) => {
                this.events.on(eventName, arg1);
            });
        }
        else {
            throw new Error("Invalid arguments");
        }
    }
    once(arg1, arg2) {
        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
            this.events.once(arg1, arg2);
        }
        else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 2
            DefaultConnectionEvents_1.DefaultConnectionEvents.forEach((eventName) => {
                this.events.once(eventName, arg1);
            });
        }
        else {
            throw new Error("Invalid arguments");
        }
    }
    off(arg1, arg2) {
        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
            this.events.off(arg1, arg2);
        }
        else if (Array.isArray(arg1) && typeof arg2 === "function") {
            // Overload 2
            arg1.forEach((eventName) => {
                this.events.off(eventName, arg2);
            });
        }
        else if (typeof arg1 === "string" && arg2 === undefined) {
            // Overload 3
            this.events.off(arg1);
        }
        else if (Array.isArray(arg1) && arg2 === undefined) {
            // Overload 4
            this.events.removeAllListeners(arg1);
        }
        else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 5
            this.events.off(arg1);
        }
        else if (arg1 === undefined && arg2 === undefined) {
            // Overload 6
            this.events.removeAllListeners();
        }
        else {
            throw new Error("Invalid arguments");
        }
    }
    destroy() {
        this.ws.destroy();
        this.off();
    }
}
exports.Connection = Connection;

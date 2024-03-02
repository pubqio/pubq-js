import { App } from "./App";
import { DefaultChannelEvents } from "./defaults/DefaultChannelEvents";
import { WebSocket } from "./WebSocket";
import { ChannelManager } from "./ChannelManager";
import { Message } from "./Message";
var EventEmitter = require("eventemitter3");
class RealTimeChannels {
    options;
    ws;
    app;
    channel = null;
    events = new EventEmitter();
    manager = new ChannelManager();
    constructor(options) {
        this.options = options;
        this.ws = WebSocket.getInstance();
        this.app = App.getInstance();
    }
    get state() {
        return this.manager.currentState;
    }
    get(channelName) {
        const socket = this.ws.getSocket();
        this.channel = socket.channel(`${this.app.getId()}/${channelName}`);
        this.handleSubscribeEvent();
        this.handleUnsubscribeEvent();
        this.handleSubscribeFailEvent();
        return this;
    }
    async handleSubscribeEvent() {
        return new Promise(async (resolve) => {
            for await (let event of this.channel.listener("subscribe")) {
                this.events.emit("subscribed", this.manager.stateChangeObject("subscribed"));
                resolve();
            }
        });
    }
    async handleUnsubscribeEvent() {
        return new Promise(async (resolve) => {
            for await (let event of this.channel.listener("unsubscribe")) {
                this.events.emit("unsubscribed", this.manager.stateChangeObject("unsubscribed"));
                resolve();
            }
        });
    }
    async handleSubscribeFailEvent() {
        const socket = this.ws.getSocket();
        return new Promise(async (resolve) => {
            for await (let error of socket.listener("subscribeFail")) {
                this.events.emit("failed", this.manager.stateChangeObject("failed", "failed", error));
                resolve();
            }
        });
    }
    async handleChannelDataEvent(listener) {
        return new Promise(async (resolve) => {
            for await (let data of this.channel) {
                const msg = new Message({
                    data: data,
                }).toObject();
                listener(msg);
                resolve();
            }
        });
    }
    subscribe(arg1, arg2) {
        if (!this.channel) {
            throw new Error("Channel is not specified.");
        }
        this.events.emit("subscribing", this.manager.stateChangeObject("subscribing"));
        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
        }
        else if (Array.isArray(arg1) && typeof arg2 === "function") {
            // Overload 2
        }
        else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 3
            this.channel.subscribe();
            this.handleChannelDataEvent(arg1);
        }
    }
    unsubscribe(arg1, arg2) {
        if (!this.channel) {
            throw new Error("Channel is not specified.");
        }
        this.events.emit("unsubscribing", this.manager.stateChangeObject("unsubscribing"));
        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
        }
        else if (Array.isArray(arg1) && typeof arg2 === "function") {
            // Overload 2
        }
        else if (typeof arg1 === "string" && arg2 === undefined) {
            // Overload 3
        }
        else if (Array.isArray(arg1) && arg2 === undefined) {
            // Overload 4
        }
        else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 5
        }
        else if (typeof arg1 === undefined && arg2 === undefined) {
            // Overload 6
            this.channel.unsubscribe();
        }
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
            DefaultChannelEvents.forEach((eventName) => {
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
            DefaultChannelEvents.forEach((eventName) => {
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
        if (this.channel) {
            this.channel.unsubscribe();
            this.channel.killAllListeners();
            this.channel.kill();
        }
        this.off();
    }
}
export { RealTimeChannels };

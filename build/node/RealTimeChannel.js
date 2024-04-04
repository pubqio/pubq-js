"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealTimeChannel = void 0;
const App_1 = require("./App");
const DefaultChannelEvents_1 = require("./defaults/DefaultChannelEvents");
const WebSocket_1 = require("./WebSocket");
const ChannelManager_1 = require("./ChannelManager");
const Message_1 = require("./Message");
const OptionsManager_1 = require("./OptionsManager");
var EventEmitter = require("eventemitter3");
class RealTimeChannel {
    options;
    ws;
    app;
    channel = null;
    channelName = null;
    events = new EventEmitter();
    manager = new ChannelManager_1.ChannelManager();
    constructor(channelName) {
        this.options = OptionsManager_1.OptionsManager.getInstance().get();
        this.ws = WebSocket_1.WebSocket.getInstance();
        this.app = App_1.App.getInstance();
        this.channelName = channelName;
        this.init();
    }
    get state() {
        return this.manager.currentState;
    }
    init() {
        const socket = this.ws.getSocket();
        this.channel = socket.channel(`${this.app.getId()}/${this.channelName}`);
        this.handleSubscribeEvent();
        this.handleUnsubscribeEvent();
        this.handleSubscribeFailEvent();
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
                const msg = new Message_1.Message({
                    data: data,
                    channel: this.channel.name,
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
        const socket = this.ws.getSocket();
        if (socket.isSubscribed(`${this.app.getId()}/${this.channelName}`, true)) {
            const error = {
                code: 201,
                message: "The channel has already been subscribed.",
            };
            this.events.emit("failed", this.manager.stateChangeObject("failed", "failed", error));
            return false;
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
        const socket = this.ws.getSocket();
        if (!socket.isSubscribed(`${this.app.getId()}/${this.channelName}`, true)) {
            const error = {
                code: 203,
                message: "Can not unsubscribe from a channel that is not subscribed.",
            };
            this.events.emit("failed", this.manager.stateChangeObject("failed", "failed", error));
            return false;
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
        else if (arg1 === undefined && arg2 === undefined) {
            // Overload 6
            socket.unsubscribe(`${this.app.getId()}/${this.channelName}`);
        }
    }
    publish(data) {
        const socket = this.ws.getSocket();
        socket.transmitPublish(`${this.app.getId()}/${this.channelName}`, data);
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
            DefaultChannelEvents_1.DefaultChannelEvents.forEach((eventName) => {
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
            DefaultChannelEvents_1.DefaultChannelEvents.forEach((eventName) => {
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
            this.unsubscribe();
            this.channel.killAllListeners();
            this.channel.kill();
        }
        this.off();
    }
}
exports.RealTimeChannel = RealTimeChannel;

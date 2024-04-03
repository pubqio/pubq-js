import { App } from "./App";
import { DefaultChannelEvents } from "./defaults/DefaultChannelEvents";
import { ChannelEvent } from "./types/Events";
import { ChannelListener, MessageListener } from "./types/Listeners";
import { ChannelState } from "./types/States";
import { WebSocket } from "./WebSocket";
import { ChannelManager } from "./ChannelManager";
import { Message } from "./Message";
import { CommonOptions } from "./types/CommonOptions";
import { OptionsManager } from "./OptionsManager";

var EventEmitter = require("eventemitter3");

class RealTimeChannel {
    private options: CommonOptions;

    private ws;

    private app;

    private channel: any = null;

    private channelName: string | null = null;

    private events = new EventEmitter();

    private manager = new ChannelManager();

    constructor(channelName: string) {
        this.options = OptionsManager.getInstance().get();

        this.ws = WebSocket.getInstance();

        this.app = App.getInstance();

        this.channelName = channelName;

        this.init();
    }

    get state(): ChannelState {
        return this.manager.currentState;
    }

    private init() {
        const socket: any = this.ws.getSocket();

        this.channel = socket.channel(
            `${this.app.getId()}/${this.channelName}`
        );

        this.handleSubscribeEvent();
        this.handleUnsubscribeEvent();
        this.handleSubscribeFailEvent();
    }

    private async handleSubscribeEvent(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            for await (let event of this.channel.listener("subscribe")) {
                this.events.emit(
                    "subscribed",
                    this.manager.stateChangeObject("subscribed")
                );

                resolve();
            }
        });
    }

    private async handleUnsubscribeEvent(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            for await (let event of this.channel.listener("unsubscribe")) {
                this.events.emit(
                    "unsubscribed",
                    this.manager.stateChangeObject("unsubscribed")
                );

                resolve();
            }
        });
    }

    private async handleSubscribeFailEvent(): Promise<void> {
        const socket: any = this.ws.getSocket();

        return new Promise<void>(async (resolve) => {
            for await (let error of socket.listener("subscribeFail")) {
                this.events.emit(
                    "failed",
                    this.manager.stateChangeObject("failed", "failed", error)
                );

                resolve();
            }
        });
    }

    private async handleChannelDataEvent(
        listener: MessageListener
    ): Promise<void> {
        return new Promise<void>(async (resolve) => {
            for await (let data of this.channel) {
                const msg = new Message({
                    data: data,
                    channel: this.channel.name,
                }).toObject();
                listener(msg);

                resolve();
            }
        });
    }

    // Overload 1: subscribe(event: string, listener: MessageListener)
    subscribe(event: string, listener: MessageListener): void;

    // Overload 2: subscribe(events: string[], listener: MessageListener)
    subscribe(events: string[], listener: MessageListener): void;

    // Overload 3: subscribe(listener: MessageListener)
    subscribe(listener: MessageListener): void;

    subscribe(
        arg1: string | string[] | MessageListener,
        arg2?: MessageListener
    ) {
        if (!this.channel) {
            throw new Error("Channel is not specified.");
        }

        const socket: any = this.ws.getSocket();

        if (
            socket.isSubscribed(`${this.app.getId()}/${this.channelName}`, true)
        ) {
            const error = {
                code: 201,
                message: "The channel has already been subscribed.",
            };

            this.events.emit(
                "failed",
                this.manager.stateChangeObject("failed", "failed", error)
            );
            return false;
        }

        this.events.emit(
            "subscribing",
            this.manager.stateChangeObject("subscribing")
        );

        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
        } else if (Array.isArray(arg1) && typeof arg2 === "function") {
            // Overload 2
        } else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 3
            this.channel.subscribe();
            this.handleChannelDataEvent(arg1);
        }
    }

    // Overload 1: unsubscribe(event: string, listener: MessageListener)
    unsubscribe(event: string, listener: MessageListener): void;

    // Overload 2: unsubscribe(events: string[], listener: MessageListener)
    unsubscribe(events: string[], listener: MessageListener): void;

    // Overload 3: unsubscribe(event: string)
    unsubscribe(event: string): void;

    // Overload 4: unsubscribe(events: string[])
    unsubscribe(events: string[]): void;

    // Overload 5: unsubscribe(listener: MessageListener)
    unsubscribe(listener: MessageListener): void;

    // Overload 6: unsubscribe()
    unsubscribe(): void;

    unsubscribe(
        arg1?: string | string[] | MessageListener,
        arg2?: MessageListener
    ) {
        if (!this.channel) {
            throw new Error("Channel is not specified.");
        }

        const socket: any = this.ws.getSocket();

        if (
            !socket.isSubscribed(
                `${this.app.getId()}/${this.channelName}`,
                true
            )
        ) {
            const error = {
                code: 203,
                message:
                    "Can not unsubscribe from a channel that is not subscribed.",
            };

            this.events.emit(
                "failed",
                this.manager.stateChangeObject("failed", "failed", error)
            );

            return false;
        }

        this.events.emit(
            "unsubscribing",
            this.manager.stateChangeObject("unsubscribing")
        );

        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
        } else if (Array.isArray(arg1) && typeof arg2 === "function") {
            // Overload 2
        } else if (typeof arg1 === "string" && arg2 === undefined) {
            // Overload 3
        } else if (Array.isArray(arg1) && arg2 === undefined) {
            // Overload 4
        } else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 5
        } else if (arg1 === undefined && arg2 === undefined) {
            // Overload 6
            socket.unsubscribe(`${this.app.getId()}/${this.channelName}`);
        }
    }

    publish(data: any) {
        const socket: any = this.ws.getSocket();
        socket.transmitPublish(`${this.app.getId()}/${this.channelName}`, data);
    }

    // Overload 1: on(event: ChannelEvent, listener: ChannelListener)
    on(event: ChannelEvent, listener: ChannelListener): void;

    // Overload 2: on(events: ChannelEvent[], listener: ChannelListener)
    on(events: ChannelEvent[], listener: ChannelListener): void;

    // Overload 3: on(listener: ChannelListener)
    on(listener: ChannelListener): void;

    // Implementation of the on method
    on(
        arg1: ChannelEvent | ChannelEvent[] | ChannelListener,
        arg2?: ChannelListener
    ) {
        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
            this.events.on(arg1, arg2);
        } else if (Array.isArray(arg1) && typeof arg2 === "function") {
            // Overload 2
            arg1.forEach((eventName) => {
                this.events.on(eventName, arg2);
            });
        } else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 3
            DefaultChannelEvents.forEach((eventName) => {
                this.events.on(eventName, arg1);
            });
        } else {
            throw new Error("Invalid arguments");
        }
    }

    // Overload 1: once(event: ChannelEvent, listener: ChannelListener)
    once(event: ChannelEvent, listener: ChannelListener): void;

    // Overload 2: on(listener: ChannelListener)
    once(listener: ChannelListener): void;

    once(
        arg1: ChannelEvent | ChannelEvent[] | ChannelListener,
        arg2?: ChannelListener
    ) {
        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
            this.events.once(arg1, arg2);
        } else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 2
            DefaultChannelEvents.forEach((eventName) => {
                this.events.once(eventName, arg1);
            });
        } else {
            throw new Error("Invalid arguments");
        }
    }

    // Overload 1: off(event: string, listener: Function)
    off(event: ChannelEvent, listener: Function): void;

    // Overload 2: off(events: ChannelEvent[], listener: Function)
    off(events: ChannelEvent[], listener: Function): void;

    // Overload 3: off(event: ChannelEvent)
    off(event: ChannelEvent): void;

    // Overload 4: off(events: ChannelEvent[])
    off(events: ChannelEvent[]): void;

    // Overload 5: off(listener: Listener)
    off(listener: Function): void;

    // Overload 6: off()
    off(): void;

    off(arg1?: string | string[] | Function, arg2?: Function) {
        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
            this.events.off(arg1, arg2);
        } else if (Array.isArray(arg1) && typeof arg2 === "function") {
            // Overload 2
            arg1.forEach((eventName) => {
                this.events.off(eventName, arg2);
            });
        } else if (typeof arg1 === "string" && arg2 === undefined) {
            // Overload 3
            this.events.off(arg1);
        } else if (Array.isArray(arg1) && arg2 === undefined) {
            // Overload 4
            this.events.removeAllListeners(arg1);
        } else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 5
            this.events.off(arg1);
        } else if (arg1 === undefined && arg2 === undefined) {
            // Overload 6
            this.events.removeAllListeners();
        } else {
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

export { RealTimeChannel };

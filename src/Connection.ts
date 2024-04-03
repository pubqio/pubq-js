import { App } from "./App";
import { DefaultConnectionEvents } from "./defaults/DefaultConnectionEvents";
import { CommonOptions } from "./types/CommonOptions";
import { ConnectionEvent } from "./types/Events";
import { ConnectionListener } from "./types/Listeners";
import { ConnectionState } from "./types/States";
import { WebSocket } from "./WebSocket";
import { ConnectionManager } from "./ConnectionManager";
import { Auth } from "./Auth";
import { OptionsManager } from "./OptionsManager";

var EventEmitter = require("eventemitter3");

class Connection {
    private options: CommonOptions;

    private ws;

    private app;

    private auth;

    private events = new EventEmitter();

    private manager = new ConnectionManager();

    constructor() {
        this.options = OptionsManager.getInstance().get();

        this.ws = WebSocket.getInstance();

        this.app = App.getInstance();

        this.auth = Auth.getInstance();

        if (this.options.autoConnect) {
            this.connect();
        }
    }

    get state(): ConnectionState {
        return this.manager.currentState;
    }

    get id(): string | undefined {
        const socket: any = this.ws.getSocket();
        return socket.id;
    }

    async connect() {
        const socket: any = this.ws.getSocket();

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

    private handleConnectingEvent(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.events.emit(
                "connecting",
                this.manager.stateChangeObject("connecting")
            );

            resolve();
        });
    }

    private async handleConnectEvent(): Promise<void> {
        const socket: any = this.ws.getSocket();

        return new Promise<void>(async (resolve) => {
            for await (let event of socket.listener("connect")) {
                if (event.isAuthenticated) {
                    this.events.emit(
                        "connected",
                        this.manager.stateChangeObject("connected")
                    );
                } else if (
                    this.options.autoAuthenticate &&
                    !event.isAuthenticated
                ) {
                    this.auth.authenticate();
                }

                resolve();
            }
        });
    }

    private async handleAuthenticateEvent(): Promise<void> {
        const socket: any = this.ws.getSocket();

        return new Promise<void>(async (resolve) => {
            for await (let event of socket.listener("authenticate")) {
                this.events.emit(
                    "connected",
                    this.manager.stateChangeObject("connected")
                );

                resolve();
            }
        });
    }

    private async handleDeauthenticateEvent(): Promise<void> {
        const socket: any = this.ws.getSocket();

        return new Promise<void>(async (resolve) => {
            for await (let event of socket.listener("deauthenticate")) {
                if (this.options.autoAuthenticate) {
                    this.auth.authenticate();
                }

                resolve();
            }
        });
    }

    private async handleCloseEvent(): Promise<void> {
        const socket: any = this.ws.getSocket();

        return new Promise<void>(async (resolve) => {
            for await (let event of socket.listener("close")) {
                this.events.emit(
                    "closed",
                    this.manager.stateChangeObject("closed")
                );

                socket.closeAllListeners();

                resolve();
            }
        });
    }

    private async handleErrorEvent(): Promise<void> {
        const socket: any = this.ws.getSocket();

        return new Promise<void>(async (resolve) => {
            for await (let error of socket.listener("error")) {
                this.events.emit(
                    "failed",
                    this.manager.stateChangeObject("failed", "failed", error)
                );

                resolve();
            }
        });
    }

    close() {
        const socket: any = this.ws.getSocket();

        this.events.emit("closing", this.manager.stateChangeObject("closing"));
        socket.disconnect();
    }

    // Overload 1: on(event: ConnectionEvent, listener: ConnectionListener)
    on(event: ConnectionEvent, listener: ConnectionListener): void;

    // Overload 2: on(events: ConnectionEvent[], listener: ConnectionListener)
    on(events: ConnectionEvent[], listener: ConnectionListener): void;

    // Overload 3: on(listener: ConnectionListener)
    on(listener: ConnectionListener): void;

    // Implementation of the on method
    on(
        arg1: ConnectionEvent | ConnectionEvent[] | ConnectionListener,
        arg2?: ConnectionListener
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
            DefaultConnectionEvents.forEach((eventName) => {
                this.events.on(eventName, arg1);
            });
        } else {
            throw new Error("Invalid arguments");
        }
    }

    // Overload 1: once(event: ConnectionEvent, listener: ConnectionListener)
    once(event: ConnectionEvent, listener: ConnectionListener): void;

    // Overload 2: on(listener: ConnectionListener)
    once(listener: ConnectionListener): void;

    once(
        arg1: ConnectionEvent | ConnectionEvent[] | ConnectionListener,
        arg2?: ConnectionListener
    ) {
        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
            this.events.once(arg1, arg2);
        } else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 2
            DefaultConnectionEvents.forEach((eventName) => {
                this.events.once(eventName, arg1);
            });
        } else {
            throw new Error("Invalid arguments");
        }
    }

    // Overload 1: off(event: string, listener: Function)
    off(event: ConnectionEvent, listener: Function): void;

    // Overload 2: off(events: ConnectionEvent[], listener: Function)
    off(events: ConnectionEvent[], listener: Function): void;

    // Overload 3: off(event: ConnectionEvent)
    off(event: ConnectionEvent): void;

    // Overload 4: off(events: ConnectionEvent[])
    off(events: ConnectionEvent[]): void;

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
        this.ws.destroy();
        this.off();
    }
}

export { Connection };

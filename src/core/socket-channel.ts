import { ChannelActions, ChannelResponseActions } from "types/action.type";
import { BaseChannel } from "./channel";
import { WebSocketClient } from "./websocket-client";
import { ChannelEvents } from "types/event.type";
import { IncomingChannelMessage } from "interfaces/message.interface";

export class SocketChannel extends BaseChannel {
    private wsClient: WebSocketClient;
    private subscribed: boolean = false;
    private messageCallback?: (message: any) => void;

    constructor(name: string, wsClient: WebSocketClient) {
        super(name);
        this.wsClient = wsClient;
        this.setupMessageHandler();
    }

    private setupMessageHandler(): void {
        const socket = this.wsClient.getSocket();
        if (!socket) {
            return;
        }

        socket.onmessage = (event) => {
            try {
                const message = JSON.parse(
                    event.data
                ) as IncomingChannelMessage;
                this.handleMessage(message);
            } catch (error) {
                console.error("Error parsing message:", error);
                this.emit(ChannelEvents.FAILED, error);
            }
        };
    }

    private handleMessage(message: IncomingChannelMessage): void {
        if (message.channel !== this.name) {
            return;
        }

        switch (message.action) {
            case ChannelResponseActions.MESSAGE:
                if (this.isSubscribed()) {
                    this.messageCallback?.(message);
                }
                break;

            case ChannelResponseActions.SUBSCRIBED:
                this.subscribed = true;
                this.emit(ChannelEvents.SUBSCRIBED);
                break;

            case ChannelResponseActions.UNSUBSCRIBED:
                this.subscribed = false;
                this.messageCallback = undefined;
                this.emit(ChannelEvents.UNSUBSCRIBED);
                break;

            case ChannelResponseActions.FAILED:
                this.emit(ChannelEvents.FAILED, message.data);
                break;
        }
    }

    public async publish(message: any): Promise<void> {
        try {
            const publishMessage = {
                action: ChannelActions.PUBLISH,
                channel: this.name,
                data: message,
            };

            this.wsClient.send(JSON.stringify(publishMessage));
        } catch (error) {
            this.emit(ChannelEvents.FAILED, error);
            throw error;
        }
    }

    public subscribe(callback: (message: any) => void): void {
        if (this.isSubscribed()) {
            return;
        }

        this.emit(ChannelEvents.SUBSCRIBING);
        this.messageCallback = callback;

        const actionMessage = {
            action: ChannelActions.SUBSCRIBE,
            channel: this.name,
        };
        this.wsClient.send(JSON.stringify(actionMessage));
    }

    public unsubscribe(): void {
        if (!this.isSubscribed()) {
            return;
        }

        this.emit(ChannelEvents.UNSUBSCRIBING);

        const actionMessage = {
            action: ChannelActions.UNSUBSCRIBE,
            channel: this.name,
        };
        this.wsClient.send(JSON.stringify(actionMessage));
    }

    public isSubscribed(): boolean {
        return this.subscribed;
    }

    public reset(): void {
        if (this.isSubscribed()) {
            this.unsubscribe();
        }
        this.messageCallback = undefined;
        this.removeAllListeners();
    }
}

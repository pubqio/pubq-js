import { Channel } from "interfaces/channel.interface";
import { EventEmitter } from "./event-emitter";
import { ChannelEvents } from "types/event.type";

export abstract class BaseChannel extends EventEmitter implements Channel {
    public readonly name: string;

    constructor(name: string) {
        super();
        this.name = name;
        this.emit(ChannelEvents.INITIALIZED);
    }

    public getName(): string {
        return this.name;
    }

    abstract publish(message: any): Promise<void>;

    abstract reset(): void;
}

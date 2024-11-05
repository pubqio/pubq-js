import {
    ChannelAction,
    ChannelResponseAction,
    ConnectionAction,
    OutgoingAction,
    IncomingAction
} from "types/action.type";

// Base interface for all messages
export interface BaseMessage<T = any> {
    action: OutgoingAction | IncomingAction;
    data: T;
}

// Base interface for outgoing messages
export interface OutgoingMessage<T = any> extends BaseMessage<T> {
    action: OutgoingAction;
}

// Base interface for incoming messages
export interface IncomingMessage<T = any> extends BaseMessage<T> {
    action: IncomingAction;
}

// Base interface for channel-related messages
export interface ChannelMessage<T = any> extends BaseMessage<T> {
    channel: string;
}

// Outgoing channel messages (publish, subscribe, unsubscribe)
export interface OutgoingChannelMessage<T = any> extends OutgoingMessage<T>, ChannelMessage<T> {
    action: ChannelAction;
}

// Incoming channel messages (published, subscribed, unsubscribed, failed)
export interface IncomingChannelMessage<T = any> extends IncomingMessage<T>, ChannelMessage<T> {
    action: ChannelResponseAction;
}

// Connection-specific messages (connected, disconnected, failed)
export interface ConnectionMessage<T = any> extends IncomingMessage<T> {
    action: ConnectionAction;
    connectionId: string;
}

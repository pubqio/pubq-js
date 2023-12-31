export type ConnectionState =
    | "initialized"
    | "connecting"
    | "connected"
    | "disconnected"
    | "suspended"
    | "closing"
    | "closed"
    | "failed";

export type ChannelState =
    | "initialized"
    | "subscribing"
    | "subscribed"
    | "unsubscribing"
    | "unsubscribed"
    | "suspended"
    | "failed";

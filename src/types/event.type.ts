export type ConnectionEvent =
    | "initialized"
    | "connecting"
    | "connected"
    | "disconnected"
    | "closing"
    | "closed"
    | "failed";

export type ChannelEvent =
    | "initialized"
    | "subscribing"
    | "subscribed"
    | "unsubscribing"
    | "unsubscribed"
    | "failed";

export type ConnectionEvent =
    | "initialized"
    | "connecting"
    | "connected"
    | "disconnected"
    | "suspended"
    | "closing"
    | "closed"
    | "failed"
    | "update";

export type ChannelEvent =
    | "initialized"
    | "subscribing"
    | "subscribed"
    | "unsubscribing"
    | "unsubscribed"
    | "suspended"
    | "failed"
    | "update";

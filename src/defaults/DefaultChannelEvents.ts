import { ChannelEvent } from "../types/Events";

export const DefaultChannelEvents: ChannelEvent[] = [
    "initialized",
    "subscribing",
    "subscribed",
    "unsubscribing",
    "unsubscribed",
    "suspended",
    "failed",
    "update",
];

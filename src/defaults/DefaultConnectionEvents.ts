import { ConnectionEvent } from "../types/Events";

export const DefaultConnectionEvents: ConnectionEvent[] = [
    "initialized",
    "connecting",
    "connected",
    "disconnected",
    "suspended",
    "closing",
    "closed",
    "failed",
    "update",
];

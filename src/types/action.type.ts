export const SendActions = {
    SUBSCRIBE: "subscribe",
    UNSUBSCRIBE: "unsubscribe",
    PUBLISH: "publish",
} as const;

export type SendAction = (typeof SendActions)[keyof typeof SendActions];

export const ResponseActions = {
    CONNECTED: "connected",
    DISCONNECTED: "disconnected",
    ERROR: "error",
    SUBSCRIBED: "subscribed",
    UNSUBSCRIBED: "unsubscribed",
    PUBLISHED: "published",
} as const;

export type ResponseAction =
    (typeof ResponseActions)[keyof typeof ResponseActions];

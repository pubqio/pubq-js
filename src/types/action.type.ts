// Channel-related outgoing actions
export const ChannelActions = {
    SUBSCRIBE: "subscribe",
    UNSUBSCRIBE: "unsubscribe",
    PUBLISH: "publish",
} as const;

export type ChannelAction =
    (typeof ChannelActions)[keyof typeof ChannelActions];

// Channel-related incoming actions
export const ChannelResponseActions = {
    SUBSCRIBED: "subscribed", // Subscribed to a channel
    UNSUBSCRIBED: "unsubscribed", // Unsubscribed from a channel
    PUBLISHED: "published", // Published a message to a channel
    FAILED: "failed", // Failed to subscribe or publish
    MESSAGE: "message", // New message received action
} as const;

export type ChannelResponseAction =
    (typeof ChannelResponseActions)[keyof typeof ChannelResponseActions];

// Connection-related actions
export const ConnectionActions = {
    CONNECTED: "connected",
    DISCONNECTED: "disconnected",
    FAILED: "failed",
} as const;

export type ConnectionAction =
    (typeof ConnectionActions)[keyof typeof ConnectionActions];

// Combined types for message interfaces
export type OutgoingAction = ChannelAction;
export type IncomingAction = ChannelResponseAction | ConnectionAction;

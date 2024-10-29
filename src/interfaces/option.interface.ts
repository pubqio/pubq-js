export interface Option {
    apiKey?: string;

    httpHost?: string;
    httpPort?: number;

    wsHost?: string;
    wsPort?: number;

    isSecure?: boolean;

    authUrl?: string;

    autoConnect?: boolean;
    autoReconnect?: boolean;
    autoResubscribe?: boolean;

    connectTimeoutMs?: number;
    reconnectIntervalMs?: number;
    resubscribeIntervalMs?: number;
}

export const DEFAULT_OPTIONS: Option = {
    httpHost: "localhost",
    httpPort: 8080,

    wsHost: "localhost",
    wsPort: 8081,

    isSecure: false,

    autoConnect: true,
    autoReconnect: true,
    autoResubscribe: true,

    connectTimeoutMs: 3000,
    reconnectIntervalMs: 1000,
    resubscribeIntervalMs: 1000,
};

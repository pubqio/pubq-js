import { TokenRequest } from "./token.interface";

export interface AuthOptions {
    headers?: Record<string, string>;
    body?: Record<string, any>;
}

export interface Option {
    apiKey?: string;
    authUrl?: string;
    authOptions?: AuthOptions;
    tokenRequest?: TokenRequest;

    httpHost?: string;
    httpPort?: number | null;

    wsHost?: string;
    wsPort?: number | null;

    isSecure?: boolean;

    autoConnect?: boolean;
    autoReconnect?: boolean;
    autoResubscribe?: boolean;
    autoAuthenticate?: boolean;

    connectTimeout?: number;

    maxReconnectAttempts?: number;
    initialReconnectDelay?: number;
    maxReconnectDelay?: number;
    reconnectBackoffMultiplier?: number;

    resubscribeIntervalMs?: number;
    authenticateRetries?: number;
    authenticateRetryIntervalMs?: number;

    pingTimeoutMs?: number;
}

export const DEFAULT_OPTIONS: Option = {
    httpHost: "rest.pubq.io",
    httpPort: null,

    wsHost: "socket.pubq.io",
    wsPort: null,

    isSecure: true,

    autoConnect: true,
    autoReconnect: true,
    autoResubscribe: true,
    autoAuthenticate: true,

    connectTimeout: 3000,

    maxReconnectAttempts: 10,
    initialReconnectDelay: 1000,
    maxReconnectDelay: 30000,
    reconnectBackoffMultiplier: 1.5,
    
    resubscribeIntervalMs: 1000,
    authenticateRetries: 3,
    authenticateRetryIntervalMs: 1000,

    pingTimeoutMs: 10000,
};

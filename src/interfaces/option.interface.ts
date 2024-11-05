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

    connectTimeoutMs?: number;
    reconnectIntervalMs?: number;
    resubscribeIntervalMs?: number;
    authenticateRetries?: number;
    authenticateRetryIntervalMs?: number;
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

    connectTimeoutMs: 3000,
    reconnectIntervalMs: 1000,
    resubscribeIntervalMs: 1000,
    authenticateRetries: 3,
    authenticateRetryIntervalMs: 1000,
};

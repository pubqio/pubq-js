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
    autoResubscribe?: boolean; // Not used yet
    autoAuthenticate?: boolean;

    connectTimeoutMs?: number; // Not used yet

    maxReconnectAttempts?: number;
    initialReconnectDelayMs?: number;
    maxReconnectDelayMs?: number;
    reconnectBackoffMultiplier?: number;

    resubscribeIntervalMs?: number; // Not used yet
    authenticateRetries?: number;
    authenticateRetryIntervalMs?: number;

    pingTimeoutMs?: number;

    debug?: boolean;
    logLevel?: "error" | "warn" | "info" | "debug" | "trace";
    logger?: (level: string, message: string, ...args: any[]) => void;
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

    connectTimeoutMs: 5000,

    maxReconnectAttempts: 10,
    initialReconnectDelayMs: 1000,
    maxReconnectDelayMs: 30000,
    reconnectBackoffMultiplier: 1.5,

    resubscribeIntervalMs: 1000,
    authenticateRetries: 3,
    authenticateRetryIntervalMs: 1000,

    pingTimeoutMs: 10000,

    debug: false,
    logLevel: "error",
};

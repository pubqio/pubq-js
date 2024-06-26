export type CommonOptions = {
    key?: string;

    authUrl?: string;
    refreshUrl?: string;
    revokeUrl?: string;

    authBody?: object;
    authHeaders?: object;

    authTokenName?: string;

    autoConnect?: boolean;
    autoReconnect?: boolean;
    autoAuthenticate?: boolean;
    autoRefreshToken?: boolean;
    refreshTokenInterval?: number;
    autoSubscribeOnConnect?: boolean;
    connectTimeout?: number;
    ackTimeout?: number;
    timestampRequests?: boolean;
    timestampParam?: string;
    binaryType?: string;
    batchOnHandshake?: boolean;
    batchOnHandshakeDuration?: number;
    batchInterval?: number;
    protocolVersion?: number;
    wsOptions?: object;
    cloneData?: boolean;
};

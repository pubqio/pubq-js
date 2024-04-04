"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCommonOptions = void 0;
exports.DefaultCommonOptions = {
    key: undefined,
    authUrl: undefined,
    refreshUrl: undefined,
    revokeUrl: undefined,
    authBody: {},
    authHeaders: {},
    authTokenName: "pubq.authToken",
    autoConnect: true,
    autoReconnect: true,
    autoAuthenticate: true,
    autoRefreshToken: true,
    refreshTokenInterval: 1000,
    autoSubscribeOnConnect: true,
    connectTimeout: 20000,
    ackTimeout: 10000,
    timestampRequests: false,
    timestampParam: "t",
    binaryType: "arraybuffer",
    batchOnHandshake: false,
    batchOnHandshakeDuration: 100,
    batchInterval: 50,
    protocolVersion: 2,
    wsOptions: {},
    cloneData: false,
};

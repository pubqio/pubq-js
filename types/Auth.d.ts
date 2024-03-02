import { CommonOptions } from "./types/CommonOptions";
declare class Auth {
    private options;
    private http;
    private client;
    private ws;
    private refreshTokenIntervalId;
    constructor(options: CommonOptions);
    getAuthMethod(): false | "Bearer" | "Basic";
    private getKeyOrToken;
    getKey(): string;
    getKeyBase64(): string;
    makeAuthorizationHeader(): string;
    basicAuth(): void;
    authenticate(body?: object, headers?: object): Promise<void>;
    deauthenticate(): void;
    requestToken(): Promise<any>;
    requestRefresh(): Promise<any>;
    requestRevoke(): Promise<any>;
    startRefreshTokenInterval(): void;
    stopRefreshTokenInterval(): void;
    destroy(): void;
}
export { Auth };

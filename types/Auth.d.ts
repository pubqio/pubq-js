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
    isAuthenticated(): any;
    basicAuth(): void;
    authenticate(body?: object, headers?: object): Promise<void>;
    deauthenticate(): any;
    requestToken(): Promise<any>;
    requestRefresh(): Promise<any>;
    requestRevoke(): Promise<any>;
    startRefreshTokenInterval(): void;
    stopRefreshTokenInterval(): void;
}
export { Auth };

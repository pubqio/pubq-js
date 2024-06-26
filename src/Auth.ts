import { CommonOptions } from "./types/CommonOptions";
import { getJwtPayload, getSignedAuthToken } from "./utils/jwt";
import { getRemainingSeconds } from "./utils/time";
import { Http } from "./Http";
import { WebSocket } from "./WebSocket";
import { OptionsManager } from "./OptionsManager";

class Auth {
    private static instance: Auth;

    private options: CommonOptions;

    private http;

    private client;

    private ws = WebSocket.getInstance();

    private refreshTokenIntervalId: any;

    constructor() {
        this.options = OptionsManager.getInstance().get();

        this.http = new Http();

        this.client = this.http.getClient();
    }

    public static getInstance(): Auth {
        if (!this.instance) {
            this.instance = new Auth();
        }

        return this.instance;
    }

    getAuthMethod() {
        if (
            typeof this.options.authUrl !== "undefined" &&
            this.options.authUrl
        ) {
            return "Bearer";
        } else if (
            typeof this.options.key !== "undefined" &&
            this.options.key
        ) {
            return "Basic";
        }

        return false;
    }

    private getKeyOrToken() {
        if (!this.options.authTokenName) {
            throw new Error("Auth token name can not be empty.");
        }

        if (this.options.authUrl) {
            return getSignedAuthToken(this.options.authTokenName);
        } else if (this.options.key) {
            return this.getKeyBase64();
        }

        return false;
    }

    getKey() {
        if (this.options.key) {
            return this.options.key;
        }

        throw new Error("API key has not been specified.");
    }

    getKeyBase64() {
        return Buffer.from(this.getKey()).toString("base64");
    }

    makeAuthorizationHeader() {
        if (this.getAuthMethod() && this.getKeyOrToken()) {
            return `${this.getAuthMethod()} ${this.getKeyOrToken()}`;
        }

        throw new Error("Auth method has not been specified.");
    }

    basicAuth() {
        const socket: any = this.ws.getSocket();
        const credentials: Record<string, any> = {};

        credentials.key = this.getKey();

        socket.invoke("#basicAuth", credentials);
    }

    async authenticate(body: object = {}, headers: object = {}) {
        if (!this.ws) {
            this.ws = WebSocket.getInstance();
        }

        const socket: any = this.ws.getSocket();
        const authMethod = this.getAuthMethod();

        if (authMethod === "Basic") {
            this.basicAuth();
        } else if (authMethod === "Bearer") {
            const tokenData = await this.requestToken();
            socket.authenticate(tokenData.token);
        }
    }

    deauthenticate() {
        const socket: any = this.ws.getSocket();

        this.requestRevoke();
        socket.deauthenticate();
    }

    async requestToken() {
        if (this.options.authUrl && this.options.authTokenName) {
            try {
                const response = await this.client.post(
                    this.options.authUrl,
                    this.options.authBody,
                    { headers: this.options.authHeaders }
                );

                localStorage.setItem(
                    this.options.authTokenName,
                    response.data.data.token
                );

                return response.data.data;
            } catch (error) {
                console.error("Error in requestToken:", error);
                throw error;
            }
        }

        throw new Error("Auth URL has not been provided.");
    }

    async requestRefresh() {
        if (this.options.refreshUrl && this.options.authTokenName) {
            try {
                const body = {
                    ...this.options.authBody,
                    ...{
                        token: getSignedAuthToken(this.options.authTokenName),
                    },
                };

                const response = await this.client.post(
                    this.options.refreshUrl,
                    body,
                    {
                        headers: this.options.authHeaders,
                    }
                );

                localStorage.setItem(
                    this.options.authTokenName,
                    response.data.data.token
                );

                return response.data.data;
            } catch (error) {
                console.error("Error in requestRefresh:", error);
                throw error;
            }
        }

        throw new Error("Refresh URL has not been provided.");
    }

    async requestRevoke() {
        if (this.options.revokeUrl && this.options.authTokenName) {
            try {
                const body = {
                    ...this.options.authBody,
                    ...{
                        token: getSignedAuthToken(this.options.authTokenName),
                    },
                };

                const response = await this.client.post(
                    this.options.revokeUrl,
                    body,
                    {
                        headers: this.options.authHeaders,
                    }
                );

                localStorage.removeItem(this.options.authTokenName);

                return response.data.data;
            } catch (error) {
                console.error("Error in requestRevoke:", error);
                throw error;
            }
        }

        throw new Error("Revoke URL has not been provided.");
    }

    startRefreshTokenInterval() {
        if (this.getAuthMethod() === "Bearer") {
            // Stop if any refresh token interval is exist
            this.stopRefreshTokenInterval();

            this.refreshTokenIntervalId = setInterval(() => {
                if (this.options.authTokenName) {
                    const token = getSignedAuthToken(
                        this.options.authTokenName
                    );
                    const authToken = getJwtPayload(token);

                    if (authToken) {
                        const remainingSeconds = getRemainingSeconds(
                            authToken.exp
                        );
                        if (remainingSeconds <= 60) {
                            this.requestRefresh();
                        }
                    }
                }
            }, this.options.refreshTokenInterval);
        }
    }

    stopRefreshTokenInterval() {
        if (this.refreshTokenIntervalId) {
            clearInterval(this.refreshTokenIntervalId);
        }
    }

    destroy() {
        this.stopRefreshTokenInterval();
        if (this.options.authTokenName) {
            localStorage.removeItem(this.options.authTokenName);
        }
        (Auth.instance as any) = undefined;
    }
}

export { Auth };

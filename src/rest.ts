import { comonOptions } from "./types/comonOptions";
import { defaultComonOptions } from "./defaults/defaultComonOptions";
import { Http } from "./http";
import { Auth } from "./auth";
import { getJwtPayload, getSignedAuthToken } from "./utils/jwt";
import { getRemainingSeconds } from "./utils/time";

export namespace Pubq {
    export class REST {
        private options: comonOptions;

        private http;

        private client;

        private version = "v1";

        public auth;

        private refreshTokenIntervalId: any;

        constructor(options: Partial<comonOptions>, auth?: Auth) {
            this.options = { ...defaultComonOptions, ...options };

            this.http = new Http();

            this.client = this.http.getClient();

            if (typeof auth === "undefined") {
                this.auth = new Auth(this.options);
            } else {
                this.auth = auth;
            }

            if (this.options.autoRefreshToken) {
                this.startRefreshTokenInterval();
            }
        }

        async publish(channel: string, data: string | any[]): Promise<any> {
            const response = await this.client.post(
                `/${this.version}/channels/messages`,
                {
                    channel,
                    data,
                },
                {
                    headers: {
                        Authorization: this.auth.makeAuthorizationHeader(),
                    },
                }
            );

            return response;
        }

        async generateToken(clientId: string | undefined): Promise<any> {
            const response = await this.client.post(
                `/${this.version}/keys/tokens`,
                { clientId: clientId },
                {
                    headers: {
                        Authorization: this.auth.makeAuthorizationHeader(),
                    },
                }
            );

            return response;
        }

        async refreshToken(token: string): Promise<any> {
            const response = await this.client.post(
                `/${this.version}/keys/tokens/refresh`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response;
        }

        async revokeToken(token: string): Promise<any> {
            const response = await this.client.post(
                `/${this.version}/keys/tokens/revoke`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response;
        }

        async requestToken() {
            if (this.options.authUrl) {
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
            if (this.options.refreshUrl) {
                try {
                    const body = {
                        ...this.options.authBody,
                        ...{
                            token: getSignedAuthToken(
                                this.options.authTokenName
                            ),
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
            if (this.options.revokeUrl) {
                try {
                    const body = {
                        ...this.options.authBody,
                        ...{
                            token: getSignedAuthToken(
                                this.options.authTokenName
                            ),
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
            if (this.auth.getAuthMethod() === "Bearer") {
                // Stop if any refresh token interval is exist
                this.stopRefreshTokenInterval();

                this.refreshTokenIntervalId = setInterval(() => {
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
                }, this.options.refreshTokenInterval);
            }
        }

        stopRefreshTokenInterval() {
            if (this.refreshTokenIntervalId) {
                clearInterval(this.refreshTokenIntervalId);
            }
        }
    }
}

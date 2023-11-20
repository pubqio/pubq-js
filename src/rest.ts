import { comonOptions } from "./types/comonOptions";
import { defaultComonOptions } from "./defaults/defaultComonOptions";
import { Http } from "./http";
import { Auth } from "./auth";
const store = require("store");

class REST {
    private options: comonOptions;

    private http;

    private client;

    private version = "v1";

    private auth;

    constructor(options: Partial<comonOptions>, auth?: Auth) {
        this.options = { ...defaultComonOptions, ...options };

        this.http = new Http(this.options);

        this.client = this.http.getClient();

        if (typeof auth === "undefined") {
            this.auth = new Auth(this.options);
        } else {
            this.auth = auth;
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

        return response.data;
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
        if (
            typeof this.options.authUrl !== "undefined" &&
            this.options.authUrl
        ) {
            await this.client
                .post(this.options.authUrl, this.options.authBody, {
                    headers: this.options.authHeaders,
                })
                .then((response) => {
                    store.set(
                        this.options.authTokenName,
                        response.data.data.token
                    );

                    return response;
                })
                .catch((error) => {
                    throw error;
                });
        }

        throw new Error("Auth URL has not been provided.");
    }

    async requestRefresh() {
        if (
            typeof this.options.refreshUrl !== "undefined" &&
            this.options.refreshUrl
        ) {
            const body = {
                ...this.options.authBody,
                ...{ token: store.get(this.options.authTokenName) },
            };
            await this.client
                .post(this.options.refreshUrl, body, {
                    headers: this.options.authHeaders,
                })
                .then((response) => {
                    store.set(
                        this.options.authTokenName,
                        response.data.data.token
                    );

                    return response;
                })
                .catch((error) => {
                    throw error;
                });
        }

        throw new Error("Refresh URL has not been provided.");
    }

    async requestRevoke() {
        if (
            typeof this.options.revokeUrl !== "undefined" &&
            this.options.revokeUrl
        ) {
            const body = {
                ...this.options.authBody,
                ...{ token: store.get(this.options.authTokenName) },
            };
            await this.client
                .post(this.options.revokeUrl, body, {
                    headers: this.options.authHeaders,
                })
                .then((response) => {
                    store.remove(this.options.authTokenName);

                    return response;
                })
                .catch((error) => {
                    throw error;
                });
        }

        throw new Error("Revoke URL has not been provided.");
    }
}

export { REST };

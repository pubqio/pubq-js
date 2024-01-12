import { CommonOptions } from "./types/CommonOptions";
import { DefaultCommonOptions } from "./defaults/DefaultCommonOptions";
import { Http } from "./Http";
import { Auth } from "./Auth";
import { TokenOptions } from "./types/TokenOptions";

export namespace Pubq {
    export class REST {
        private options: CommonOptions;

        private http;

        private client;

        private version = "v1";

        public auth;

        constructor(options: Partial<CommonOptions>, auth?: Auth) {
            this.options = { ...DefaultCommonOptions, ...options };

            this.http = new Http();

            this.client = this.http.getClient();

            if (typeof auth === "undefined") {
                this.auth = new Auth(this.options);
            } else {
                this.auth = auth;
            }

            if (this.options.autoRefreshToken) {
                this.auth.startRefreshTokenInterval();
            }
        }

        async publish(channel: string, data: string | any[]): Promise<any> {
            const response = await this.client.post(
                `/${this.version}/channels/${channel}/messages`,
                {
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

        async generateToken(options: TokenOptions | undefined): Promise<any> {
            const response = await this.client.post(
                `/${this.version}/keys/tokens`,
                { clientId: options?.clientId },
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
    }
}

import { CommonOptions } from "./types/CommonOptions";
import { DefaultCommonOptions } from "./defaults/DefaultCommonOptions";
import { Http } from "./Http";
import { Auth } from "./Auth";
import { TokenOptions } from "./types/TokenOptions";
import { RESTChannels } from "./RESTChannels";

export namespace Pubq {
    export class REST {
        private options: CommonOptions;

        private http;

        private client;

        private version = "v1";

        public auth;

        public channels;

        constructor(options: Partial<CommonOptions>, auth?: Auth) {
            this.options = { ...DefaultCommonOptions, ...options };

            this.http = new Http();

            this.client = this.http.getClient();

            if (typeof auth === "undefined") {
                this.auth = Auth.getInstance(this.options);
            } else {
                this.auth = auth;
            }

            this.channels = new RESTChannels(this.auth);

            if (this.options.autoRefreshToken) {
                this.auth.startRefreshTokenInterval();
            }
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

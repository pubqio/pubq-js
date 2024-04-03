import { CommonOptions } from "./types/CommonOptions";
import { Http } from "./Http";
import { Auth } from "./Auth";
import { TokenOptions } from "./types/TokenOptions";
import { OptionsManager } from "./OptionsManager";
import { Channels } from "./Channels";

export namespace Pubq {
    export class REST {
        private options: CommonOptions;

        private http;

        private client;

        private version = "v1";

        public auth;

        public channels;

        constructor(options: CommonOptions, auth?: Auth) {
            this.options = OptionsManager.getInstance(options).get();

            this.http = new Http();

            this.client = this.http.getClient();

            if (typeof auth === "undefined") {
                this.auth = Auth.getInstance();
            } else {
                this.auth = auth;
            }

            this.channels = new Channels(this.constructor.name);

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

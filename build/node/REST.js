import { DefaultCommonOptions } from "./defaults/DefaultCommonOptions";
import { Http } from "./Http";
import { Auth } from "./Auth";
import { RESTChannels } from "./RESTChannels";
export var Pubq;
(function (Pubq) {
    class REST {
        options;
        http;
        client;
        version = "v1";
        auth;
        channels;
        constructor(options, auth) {
            this.options = { ...DefaultCommonOptions, ...options };
            this.http = new Http();
            this.client = this.http.getClient();
            if (typeof auth === "undefined") {
                this.auth = new Auth(this.options);
            }
            else {
                this.auth = auth;
            }
            this.channels = new RESTChannels(this.auth);
            if (this.options.autoRefreshToken) {
                this.auth.startRefreshTokenInterval();
            }
        }
        async generateToken(options) {
            const response = await this.client.post(`/${this.version}/keys/tokens`, { clientId: options?.clientId }, {
                headers: {
                    Authorization: this.auth.makeAuthorizationHeader(),
                },
            });
            return response;
        }
        async refreshToken(token) {
            const response = await this.client.post(`/${this.version}/keys/tokens/refresh`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response;
        }
        async revokeToken(token) {
            const response = await this.client.post(`/${this.version}/keys/tokens/revoke`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response;
        }
    }
    Pubq.REST = REST;
})(Pubq || (Pubq = {}));

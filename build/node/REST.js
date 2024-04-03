import { Http } from "./Http";
import { Auth } from "./Auth";
import { OptionsManager } from "./OptionsManager";
import { Channels } from "./Channels";
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
            this.options = OptionsManager.getInstance(options).get();
            this.http = new Http();
            this.client = this.http.getClient();
            if (typeof auth === "undefined") {
                this.auth = Auth.getInstance();
            }
            else {
                this.auth = auth;
            }
            this.channels = new Channels(this.constructor.name);
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

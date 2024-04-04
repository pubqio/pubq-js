"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pubq = void 0;
const Http_1 = require("./Http");
const Auth_1 = require("./Auth");
const OptionsManager_1 = require("./OptionsManager");
const Channels_1 = require("./Channels");
var Pubq;
(function (Pubq) {
    class REST {
        options;
        http;
        client;
        version = "v1";
        auth;
        channels;
        constructor(options, auth) {
            this.options = OptionsManager_1.OptionsManager.getInstance(options).get();
            this.http = new Http_1.Http();
            this.client = this.http.getClient();
            if (typeof auth === "undefined") {
                this.auth = Auth_1.Auth.getInstance();
            }
            else {
                this.auth = auth;
            }
            this.channels = new Channels_1.Channels(this.constructor.name);
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
})(Pubq || (exports.Pubq = Pubq = {}));

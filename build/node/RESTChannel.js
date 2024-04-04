"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESTChannel = void 0;
const Auth_1 = require("./Auth");
const Http_1 = require("./Http");
class RESTChannel {
    http;
    client;
    version = "v1";
    auth;
    channelName = null;
    constructor(channelName) {
        this.http = new Http_1.Http();
        this.client = this.http.getClient();
        this.auth = Auth_1.Auth.getInstance();
        this.channelName = channelName;
    }
    async publish(arg1, arg2, arg3) {
        if (typeof arg1 === "string" && typeof arg3 === "function") {
            // Overload 1
        }
        else if (Array.isArray(arg1) &&
            typeof arg2 !== "undefined" &&
            typeof arg3 === "function") {
            // Overload 2
        }
        else if (Array.isArray(arg1) && typeof arg2 === "function") {
            // Overload 3
        }
        else if (Array.isArray(arg1) && typeof arg2 === "undefined") {
            // Overload 6
        }
        else if (typeof arg2 === "undefined") {
            // Overload 5
            await this.client.post(`/${this.version}/channels/${this.channelName}/messages`, {
                data: arg1,
            }, {
                headers: {
                    Authorization: this.auth.makeAuthorizationHeader(),
                },
            });
        }
        else {
            // Overload 4
        }
    }
}
exports.RESTChannel = RESTChannel;

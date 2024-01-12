import { Http } from "./Http";
class RESTChannels {
    options;
    http;
    client;
    version = "v1";
    auth;
    channel = null;
    constructor(options, auth) {
        this.options = options;
        this.http = new Http();
        this.client = this.http.getClient();
        this.auth = auth;
    }
    get(channelName) {
        this.channel = channelName;
        return this;
    }
    async publish(arg1, arg2, arg3) {
        if (typeof arg1 === "string" && typeof arg3 === "function") {
            // Overload 1
        }
        else if (Array.isArray(arg1) && typeof arg2 !== "undefined") {
            // Overload 2
        }
        else if (Array.isArray(arg1) && typeof arg2 === "undefined") {
            // Overload 3
        }
        else {
            // Overload 4
            const response = await this.client.post(`/${this.version}/channels/${this.channel}/messages`, {
                data: arg1,
            }, {
                headers: {
                    Authorization: this.auth.makeAuthorizationHeader(),
                },
            });
        }
    }
}
export { RESTChannels };

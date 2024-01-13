import { Auth } from "./Auth";
import { Http } from "./Http";
import { CommonOptions } from "./types/CommonOptions";
import { ErrorListener } from "./types/Listeners";

class RESTChannels {
    private options: CommonOptions;

    private http;

    private client;

    private version = "v1";

    private auth;

    private channel: any = null;

    constructor(options: CommonOptions, auth: Auth) {
        this.options = options;

        this.http = new Http();

        this.client = this.http.getClient();

        this.auth = auth;
    }

    get(channelName: string) {
        this.channel = channelName;

        return this;
    }

    // Overload 1: publish(event: string, data: any, listener: ErrorListener)
    publish(event: string, data: any, listener: ErrorListener): void;

    // Overload 2: publish(events: string[], data: any, listener: ErrorListener)
    publish(events: string[], data: any, listener: ErrorListener): void;

    // Overload 3: publish(messages: any[], listener: ErrorListener)
    publish(messages: any[], listener: ErrorListener): void;

    // Overload 4: publish(data: any, listener: ErrorListener)
    publish(data: any, listener: ErrorListener): void;

    // Overload 5: publish(data: any)
    publish(data: any): void;

    // Overload 6: publish(messages: any[])
    publish(messages: any[]): void;

    async publish(
        arg1: string | string[] | any | any[],
        arg2?: any | any[] | ErrorListener,
        arg3?: ErrorListener
    ) {
        if (typeof arg1 === "string" && typeof arg3 === "function") {
            // Overload 1
        } else if (
            Array.isArray(arg1) &&
            typeof arg2 !== "undefined" &&
            typeof arg3 === "function"
        ) {
            // Overload 2
        } else if (Array.isArray(arg1) && typeof arg2 === "function") {
            // Overload 3
        } else if (Array.isArray(arg1) && typeof arg2 === "undefined") {
            // Overload 6
        } else if (typeof arg2 === "undefined") {
            // Overload 5
            await this.client.post(
                `/${this.version}/channels/${this.channel}/messages`,
                {
                    data: arg1,
                },
                {
                    headers: {
                        Authorization: this.auth.makeAuthorizationHeader(),
                    },
                }
            );
        } else {
            // Overload 4
        }
    }
}

export { RESTChannels };

import { Auth } from "./Auth";
import { CommonOptions } from "./types/CommonOptions";
import { ErrorListener } from "./types/Listeners";
declare class RESTChannels {
    private options;
    private http;
    private client;
    private version;
    private auth;
    private channel;
    constructor(options: CommonOptions, auth: Auth);
    get(channelName: string): this;
    publish(event: string, data: any, listener: ErrorListener): void;
    publish(events: string[], data: any, listener: ErrorListener): void;
    publish(messages: any[], listener: ErrorListener): void;
    publish(data: any, listener: ErrorListener): void;
}
export { RESTChannels };

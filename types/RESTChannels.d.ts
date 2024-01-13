import { Auth } from "./Auth";
import { ErrorListener } from "./types/Listeners";
declare class RESTChannels {
    private http;
    private client;
    private version;
    private auth;
    private channel;
    constructor(auth: Auth);
    get(channelName: string): this;
    publish(event: string, data: any, listener: ErrorListener): void;
    publish(events: string[], data: any, listener: ErrorListener): void;
    publish(messages: any[], listener: ErrorListener): void;
    publish(data: any, listener: ErrorListener): void;
    publish(data: any): void;
    publish(messages: any[]): void;
}
export { RESTChannels };

import { ErrorListener } from "./types/Listeners";
declare class RESTChannel {
    private http;
    private client;
    private version;
    private auth;
    private channelName;
    constructor(channelName: string);
    publish(event: string, data: any, listener: ErrorListener): void;
    publish(events: string[], data: any, listener: ErrorListener): void;
    publish(messages: any[], listener: ErrorListener): void;
    publish(data: any, listener: ErrorListener): void;
    publish(data: any): void;
    publish(messages: any[]): void;
}
export { RESTChannel };

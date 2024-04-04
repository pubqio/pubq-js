import { MessageObject } from "./types/Message";
declare class Message {
    id?: string;
    clientId?: string;
    connectionId?: string;
    data?: any;
    channel?: string;
    constructor(msg: MessageObject);
    toObject(): Record<string, any>;
}
export { Message };

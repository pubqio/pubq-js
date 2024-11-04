import { ResponseAction, SendAction } from "types/action.type";

export interface ResponseMessage {
    action: ResponseAction;
    data: any;
}

export interface SendMessage {
    action: SendAction;
    data: any;
}

export interface ConnectionMessage extends ResponseMessage {
    connectionId: string;
}

export interface PublishMessage extends SendMessage {
    channel: string;
}

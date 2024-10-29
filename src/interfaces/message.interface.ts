export interface ActionMessage {
    action: string;
    data: any;
}

export interface ResponseMessage {
    event: string;
    data: any;
}

export interface PublishMessage extends ActionMessage {
    channel: string;
}

import { ErrorInfo } from "./ErrorInfo";
import { ConnectionEvent } from "./Events";
import { ConnectionState } from "./States";

export interface ConnectionStateChange {
    current?: ConnectionState;
    previous?: ConnectionState;
    event?: ConnectionEvent;
    reason?: ErrorInfo;
}

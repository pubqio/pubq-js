import { ConnectionStateChange } from "./types/Connection";
import { ErrorInfo } from "./types/ErrorInfo";
import { ConnectionEvent } from "./types/Events";
import { ConnectionState } from "./types/States";
declare class ConnectionManager {
    previousState: ConnectionState;
    currentState: ConnectionState;
    constructor();
    stateChangeObject(state: ConnectionState, event?: ConnectionEvent, reason?: ErrorInfo): ConnectionStateChange;
}
export { ConnectionManager };

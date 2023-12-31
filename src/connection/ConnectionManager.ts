import { ConnectionStateChange } from "../types/Connection";
import { ErrorInfo } from "../types/ErrorInfo";
import { ConnectionEvent } from "../types/Events";
import { ConnectionState } from "../types/States";

class ConnectionManager {
    previousState: ConnectionState = "initialized";
    currentState: ConnectionState = "initialized";

    constructor() {}

    stateChangeObject(
        state: ConnectionState,
        event?: ConnectionEvent,
        reason?: ErrorInfo
    ): ConnectionStateChange {
        const previousState = this.currentState;
        this.currentState = state;
        this.previousState = previousState;

        return {
            current: state,
            previous: this.previousState,
            ...(event !== undefined && { event }),
            ...(reason !== undefined && { reason }),
        };
    }
}

export { ConnectionManager };

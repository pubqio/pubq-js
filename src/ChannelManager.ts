import { ChannelStateChange } from "./types/Channel";
import { ErrorInfo } from "./types/ErrorInfo";
import { ChannelEvent } from "./types/Events";
import { ChannelState } from "./types/States";

class ChannelManager {
    previousState: ChannelState = "initialized";
    currentState: ChannelState = "initialized";

    constructor() {}

    stateChangeObject(
        state: ChannelState,
        event?: ChannelEvent,
        reason?: ErrorInfo
    ): ChannelStateChange {
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

export { ChannelManager };

import { ChannelStateChange } from "./types/Channel";
import { ErrorInfo } from "./types/ErrorInfo";
import { ChannelEvent } from "./types/Events";
import { ChannelState } from "./types/States";
declare class ChannelManager {
    previousState: ChannelState;
    currentState: ChannelState;
    constructor();
    stateChangeObject(state: ChannelState, event?: ChannelEvent, reason?: ErrorInfo): ChannelStateChange;
}
export { ChannelManager };

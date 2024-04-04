import { ErrorInfo } from "./ErrorInfo";
import { ChannelEvent } from "./Events";
import { ChannelState } from "./States";
export interface ChannelStateChange {
    current?: ChannelState;
    previous?: ChannelState;
    event?: ChannelEvent;
    reason?: ErrorInfo;
}

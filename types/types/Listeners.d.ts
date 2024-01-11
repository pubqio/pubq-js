import { ChannelStateChange } from "./Channel";
import { ConnectionStateChange } from "./Connection";
import { MessageObject } from "./Message";
export type ConnectionListener = (stateChange: ConnectionStateChange) => void;
export type ChannelListener = (stateChange: ChannelStateChange) => void;
export type MessageListener = (message: MessageObject) => void;

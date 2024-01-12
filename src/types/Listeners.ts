import { ChannelStateChange } from "./Channel";
import { ConnectionStateChange } from "./Connection";
import { ErrorInfo } from "./ErrorInfo";
import { MessageObject } from "./Message";

export type ConnectionListener = (stateChange: ConnectionStateChange) => void;

export type ChannelListener = (stateChange: ChannelStateChange) => void;

export type MessageListener = (message: MessageObject) => void;

export type ErrorListener = (error?: ErrorInfo | null) => void;
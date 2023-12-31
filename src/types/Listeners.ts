import { ConnectionStateChange } from "./Connection";

export type ConnectionListener = (stateChange: ConnectionStateChange) => void;

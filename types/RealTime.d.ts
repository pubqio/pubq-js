import { CommonOptions } from "./types/CommonOptions";
import { Auth } from "./Auth";
import { Connection } from "./Connection";
import { Channels } from "./Channels";
export declare namespace Pubq {
    class RealTime {
        private options;
        auth: Auth;
        connection: Connection;
        channels: Channels;
        constructor(options: Partial<CommonOptions>);
    }
}

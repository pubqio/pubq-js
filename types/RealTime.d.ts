import { CommonOptions } from "./types/CommonOptions";
import { Auth } from "./Auth";
import { Connection } from "./Connection";
import { RealTimeChannels } from "./RealTimeChannels";
export declare namespace Pubq {
    class RealTime {
        private options;
        auth: Auth;
        connection: Connection;
        channels: RealTimeChannels;
        constructor(options: Partial<CommonOptions>);
    }
}

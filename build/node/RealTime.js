import { DefaultCommonOptions } from "./defaults/DefaultCommonOptions";
import { DefaultPrivateOptions } from "./defaults/DefaultPrivateOptions";
import { Auth } from "./Auth";
import { Connection } from "./Connection";
import { RealTimeChannels } from "./RealTimeChannels";
export var Pubq;
(function (Pubq) {
    class RealTime {
        options;
        auth;
        connection;
        channels;
        constructor(options) {
            this.options = {
                ...DefaultCommonOptions,
                ...options,
                ...DefaultPrivateOptions,
            };
            this.auth = new Auth(this.options);
            this.connection = new Connection(this.options, this.auth);
            this.channels = new RealTimeChannels(this.options);
        }
    }
    Pubq.RealTime = RealTime;
})(Pubq || (Pubq = {}));

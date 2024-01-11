import { DefaultCommonOptions } from "./defaults/DefaultCommonOptions";
import { DefaultPrivateOptions } from "./defaults/DefaultPrivateOptions";
import { Auth } from "./Auth";
import { Connection } from "./Connection";
import { Channels } from "./Channels";
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
            this.channels = new Channels(this.options);
        }
    }
    Pubq.RealTime = RealTime;
})(Pubq || (Pubq = {}));

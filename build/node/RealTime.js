import { DefaultCommonOptions } from "./defaults/DefaultCommonOptions";
import { DefaultPrivateOptions } from "./defaults/DefaultPrivateOptions";
import { Auth } from "./Auth";
import { Connection } from "./Connection";
import { RealTimeChannels } from "./RealTimeChannels";
import { App } from "./App";
export var Pubq;
(function (Pubq) {
    class RealTime {
        options;
        auth;
        connection;
        channels;
        app;
        constructor(options) {
            this.options = {
                ...DefaultCommonOptions,
                ...options,
                ...DefaultPrivateOptions,
            };
            this.auth = Auth.getInstance();
            this.connection = new Connection(this.options);
            this.channels = new RealTimeChannels(this.options);
            this.app = App.getInstance();
        }
        updateOptions(options) {
            this.options = {
                ...this.options,
                ...options,
            };
            this.auth = Auth.getInstance();
            this.connection = new Connection(this.options);
            this.channels = new RealTimeChannels(this.options);
            this.app = App.getInstance();
        }
        destroy() {
            this.auth.destroy();
            this.connection.destroy();
            this.channels.destroy();
            this.app.destroy();
        }
    }
    Pubq.RealTime = RealTime;
})(Pubq || (Pubq = {}));

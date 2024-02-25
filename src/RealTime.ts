import { CommonOptions } from "./types/CommonOptions";
import { DefaultCommonOptions } from "./defaults/DefaultCommonOptions";
import { DefaultPrivateOptions } from "./defaults/DefaultPrivateOptions";
import { Auth } from "./Auth";
import { Connection } from "./Connection";
import { RealTimeChannels } from "./RealTimeChannels";
import { App } from "./App";

export namespace Pubq {
    export class RealTime {
        public options: CommonOptions;

        public auth: any;

        public connection: any;

        public channels: any;

        public app: any;

        constructor(options: Partial<CommonOptions>) {
            this.options = {
                ...DefaultCommonOptions,
                ...options,
                ...DefaultPrivateOptions,
            };

            this.auth = new Auth(this.options);

            this.connection = new Connection(this.options, this.auth);

            this.channels = new RealTimeChannels(this.options);

            this.app = App.getInstance();
        }

        updateOptions(options: Partial<CommonOptions>) {
            this.options = {
                ...this.options,
                ...options,
            };

            this.auth = new Auth(this.options);

            this.connection = new Connection(this.options, this.auth);

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
}

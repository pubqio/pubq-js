import { CommonOptions } from "./types/CommonOptions";
import { DefaultCommonOptions } from "./defaults/DefaultCommonOptions";
import { DefaultPrivateOptions } from "./defaults/DefaultPrivateOptions";
import { Auth } from "./Auth";
import { Connection } from "./connection/Connection";
import { Channels } from "./Channels";

export namespace Pubq {
    export class RealTime {
        private options: CommonOptions;

        public auth;

        public connection;

        public channels;

        constructor(options: Partial<CommonOptions>) {
            this.options = {
                ...DefaultCommonOptions,
                ...options,
                ...DefaultPrivateOptions,
            };

            this.auth = new Auth(this.options);

            this.connection = new Connection(this.options, this.auth);

            this.channels = new Channels();
        }
    }
}

import { CommonOptions } from "./types/CommonOptions";
import { Auth } from "./Auth";
import { Connection } from "./Connection";
import { App } from "./App";
import { OptionsManager } from "./OptionsManager";
import { Channels } from "./Channels";

export namespace Pubq {
    export class RealTime {
        private optionsManager;

        public options;

        public auth: any;

        public connection: any;

        public channels: any;

        public app: any;

        constructor(options: CommonOptions) {
            this.optionsManager = OptionsManager.getInstance(options);

            this.options = this.optionsManager.get();

            this.auth = Auth.getInstance();

            this.connection = new Connection();

            this.channels = new Channels(this.constructor.name);

            this.app = App.getInstance();
        }

        updateOptions(options: CommonOptions) {
            this.destroy();

            this.optionsManager = OptionsManager.getInstance(options);

            this.options = this.optionsManager.get();

            this.auth = Auth.getInstance();

            this.connection = new Connection();

            this.channels = new Channels(this.constructor.name);

            this.app = App.getInstance();
        }

        destroy() {
            OptionsManager.destroy();
            this.auth.destroy();
            this.connection.destroy();
            this.app.destroy();
        }
    }
}

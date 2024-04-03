import { Auth } from "./Auth";
import { Connection } from "./Connection";
import { App } from "./App";
import { OptionsManager } from "./OptionsManager";
import { Channels } from "./Channels";
export var Pubq;
(function (Pubq) {
    class RealTime {
        optionsManager;
        options;
        auth;
        connection;
        channels;
        app;
        constructor(options) {
            this.optionsManager = OptionsManager.getInstance(options);
            this.options = this.optionsManager.get();
            this.auth = Auth.getInstance();
            this.connection = new Connection();
            this.channels = new Channels(this.constructor.name);
            this.app = App.getInstance();
        }
        updateOptions(options) {
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
    Pubq.RealTime = RealTime;
})(Pubq || (Pubq = {}));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pubq = void 0;
const Auth_1 = require("./Auth");
const Connection_1 = require("./Connection");
const App_1 = require("./App");
const OptionsManager_1 = require("./OptionsManager");
const Channels_1 = require("./Channels");
var Pubq;
(function (Pubq) {
    class RealTime {
        optionsManager;
        options;
        auth;
        connection;
        channels;
        app;
        constructor(options) {
            this.optionsManager = OptionsManager_1.OptionsManager.getInstance(options);
            this.options = this.optionsManager.get();
            this.auth = Auth_1.Auth.getInstance();
            this.connection = new Connection_1.Connection();
            this.channels = new Channels_1.Channels(this.constructor.name);
            this.app = App_1.App.getInstance();
        }
        updateOptions(options) {
            this.destroy();
            this.optionsManager = OptionsManager_1.OptionsManager.getInstance(options);
            this.options = this.optionsManager.get();
            this.auth = Auth_1.Auth.getInstance();
            this.connection = new Connection_1.Connection();
            this.channels = new Channels_1.Channels(this.constructor.name);
            this.app = App_1.App.getInstance();
        }
        destroy() {
            OptionsManager_1.OptionsManager.destroy();
            this.auth.destroy();
            this.connection.destroy();
            this.app.destroy();
        }
    }
    Pubq.RealTime = RealTime;
})(Pubq || (exports.Pubq = Pubq = {}));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pubq = void 0;
var Auth_1 = require("./Auth");
var Connection_1 = require("./Connection");
var App_1 = require("./App");
var OptionsManager_1 = require("./OptionsManager");
var Channels_1 = require("./Channels");
var Pubq;
(function (Pubq) {
    var RealTime = /** @class */ (function () {
        function RealTime(options) {
            this.optionsManager = OptionsManager_1.OptionsManager.getInstance(options);
            this.options = this.optionsManager.get();
            this.auth = Auth_1.Auth.getInstance();
            this.connection = new Connection_1.Connection();
            this.channels = new Channels_1.Channels(this.constructor.name);
            this.app = App_1.App.getInstance();
        }
        RealTime.prototype.updateOptions = function (options) {
            this.destroy();
            this.optionsManager = OptionsManager_1.OptionsManager.getInstance(options);
            this.options = this.optionsManager.get();
            this.auth = Auth_1.Auth.getInstance();
            this.connection = new Connection_1.Connection();
            this.channels = new Channels_1.Channels(this.constructor.name);
            this.app = App_1.App.getInstance();
        };
        RealTime.prototype.destroy = function () {
            OptionsManager_1.OptionsManager.destroy();
            this.auth.destroy();
            this.connection.destroy();
            this.app.destroy();
        };
        return RealTime;
    }());
    Pubq.RealTime = RealTime;
})(Pubq || (exports.Pubq = Pubq = {}));

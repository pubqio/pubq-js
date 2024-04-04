"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var OptionsManager_1 = require("./OptionsManager");
var Auth_1 = require("./Auth");
var jwt_1 = require("./utils/jwt");
var App = /** @class */ (function () {
    function App() {
        this.options = OptionsManager_1.OptionsManager.getInstance().get();
        this.auth = Auth_1.Auth.getInstance();
        this.handleAppId();
    }
    App.getInstance = function () {
        if (!this.instance) {
            this.instance = new App();
        }
        return this.instance;
    };
    App.prototype.getId = function () {
        return this.id;
    };
    App.prototype.setId = function (id) {
        this.id = id;
    };
    App.prototype.extractAndSetId = function (publicKey) {
        var appId = publicKey.split(".")[0];
        this.setId(appId);
        return this.id;
    };
    App.prototype.handleAppId = function () {
        if (typeof this.getId() === "undefined") {
            var authMethod = this.auth.getAuthMethod();
            if (authMethod === "Bearer" &&
                typeof this.options.authTokenName !== "undefined") {
                var token = (0, jwt_1.getSignedAuthToken)(this.options.authTokenName);
                var payload = (0, jwt_1.getJwtPayload)(token);
                if (payload) {
                    this.extractAndSetId(payload.sub);
                }
            }
            else if (authMethod === "Basic" &&
                typeof this.options.key !== "undefined") {
                this.extractAndSetId(this.options.key);
            }
        }
    };
    App.prototype.destroy = function () {
        this.setId(undefined);
        App.instance = undefined;
    };
    return App;
}());
exports.App = App;

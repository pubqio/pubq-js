"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const OptionsManager_1 = require("./OptionsManager");
const Auth_1 = require("./Auth");
const jwt_1 = require("./utils/jwt");
class App {
    static instance;
    options;
    id;
    auth;
    constructor() {
        this.options = OptionsManager_1.OptionsManager.getInstance().get();
        this.auth = Auth_1.Auth.getInstance();
        this.handleAppId();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new App();
        }
        return this.instance;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    extractAndSetId(publicKey) {
        const [appId] = publicKey.split(".");
        this.setId(appId);
        return this.id;
    }
    handleAppId() {
        if (typeof this.getId() === "undefined") {
            const authMethod = this.auth.getAuthMethod();
            if (authMethod === "Bearer" &&
                typeof this.options.authTokenName !== "undefined") {
                const token = (0, jwt_1.getSignedAuthToken)(this.options.authTokenName);
                const payload = (0, jwt_1.getJwtPayload)(token);
                if (payload) {
                    this.extractAndSetId(payload.sub);
                }
            }
            else if (authMethod === "Basic" &&
                typeof this.options.key !== "undefined") {
                this.extractAndSetId(this.options.key);
            }
        }
    }
    destroy() {
        this.setId(undefined);
        App.instance = undefined;
    }
}
exports.App = App;

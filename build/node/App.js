import { OptionsManager } from "./OptionsManager";
import { Auth } from "./Auth";
import { getJwtPayload, getSignedAuthToken } from "./utils/jwt";
class App {
    static instance;
    options;
    id;
    auth;
    constructor() {
        this.options = OptionsManager.getInstance().get();
        this.auth = Auth.getInstance();
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
                const token = getSignedAuthToken(this.options.authTokenName);
                const payload = getJwtPayload(token);
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
export { App };

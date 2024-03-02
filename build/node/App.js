import { getJwtPayload, getSignedAuthToken } from "./utils/jwt";
class App {
    static instance;
    id;
    constructor() { }
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
    handleAppId(options, auth) {
        if (typeof this.getId() === "undefined") {
            const authMethod = auth.getAuthMethod();
            if (authMethod === "Bearer") {
                const token = getSignedAuthToken(options.authTokenName);
                const payload = getJwtPayload(token);
                if (payload) {
                    this.extractAndSetId(payload.sub);
                }
            }
            else if (authMethod === "Basic" &&
                typeof options.key !== "undefined") {
                this.extractAndSetId(options.key);
            }
        }
    }
    destroy() {
        this.setId(undefined);
    }
}
export { App };

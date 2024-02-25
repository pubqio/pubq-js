import { Auth } from "./Auth";
import { CommonOptions } from "./types/CommonOptions";
import { getJwtPayload, getSignedAuthToken } from "./utils/jwt";

class App {
    private static instance: App;

    private id: string | undefined;

    constructor() {}

    public static getInstance(): App {
        if (!this.instance) {
            this.instance = new App();
        }

        return this.instance;
    }

    getId() {
        return this.id;
    }

    setId(id: string | undefined) {
        this.id = id;
    }

    extractAndSetId(publicKey: string) {
        const [appId] = publicKey.split(".");
        this.setId(appId);

        return this.id;
    }

    handleAppId(options: CommonOptions, auth: Auth) {
        if (typeof this.getId() === "undefined") {
            const authMethod = auth.getAuthMethod();

            if (authMethod === "Bearer") {
                const token = getSignedAuthToken(options.authTokenName);
                const payload = getJwtPayload(token);
                if (payload) {
                    this.extractAndSetId(payload.sub);
                }
            } else if (
                authMethod === "Basic" &&
                typeof options.key !== "undefined"
            ) {
                this.extractAndSetId(options.key);
            }
        }
    }

    destroy() {
        this.setId(undefined);
    }
}

export { App };

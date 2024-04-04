import { OptionsManager } from "./OptionsManager";
import { Auth } from "./Auth";
import { CommonOptions } from "./types/CommonOptions";
import { getJwtPayload, getSignedAuthToken } from "./utils/jwt";

class App {
    private static instance: App;

    private options: CommonOptions;

    private id: string | undefined;

    private auth;

    constructor() {
        this.options = OptionsManager.getInstance().get();

        this.auth = Auth.getInstance();

        this.handleAppId();
    }

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

    handleAppId() {
        if (typeof this.getId() === "undefined") {
            const authMethod = this.auth.getAuthMethod();

            if (
                authMethod === "Bearer" &&
                typeof this.options.authTokenName !== "undefined"
            ) {
                const token = getSignedAuthToken(this.options.authTokenName);
                const payload = getJwtPayload(token);
                if (payload) {
                    this.extractAndSetId(payload.sub);
                }
            } else if (
                authMethod === "Basic" &&
                typeof this.options.key !== "undefined"
            ) {
                this.extractAndSetId(this.options.key);
            }
        }
    }

    destroy() {
        this.setId(undefined);
        (App.instance as any) = undefined;
    }
}

export { App };

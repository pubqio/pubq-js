import { comonOptions } from "./types/comonOptions";
import { Http } from "./http";
import { REST } from "./rest";
import { getSignedAuthToken } from "./utils/jwt";

class Auth {
    private options: comonOptions;

    private http;

    private rest: any;

    constructor(options: comonOptions) {
        this.options = options;

        this.http = new Http(this.options);
    }

    private initRest() {
        this.rest = new REST(this.options, this);
    }

    getAuthMethod() {
        if (
            typeof this.options.authUrl !== "undefined" &&
            this.options.authUrl
        ) {
            return "Bearer";
        } else if (
            typeof this.options.key !== "undefined" &&
            this.options.key
        ) {
            return "Basic";
        }

        return false;
    }

    private getKeyOrToken() {
        if (!this.options.authTokenName) {
            throw new Error("Auth token name can not be empty.");
        }

        if (this.options.authUrl) {
            return getSignedAuthToken(this.options.authTokenName);
        } else if (this.options.key) {
            return this.getKeyBase64();
        }

        return false;
    }

    getKey() {
        if (this.options.key) {
            return this.options.key;
        }

        throw new Error("API key has not been specified.");
    }

    getKeyBase64() {
        return Buffer.from(this.getKey()).toString("base64");
    }

    makeAuthorizationHeader() {
        if (this.getAuthMethod() && this.getKeyOrToken()) {
            return `${this.getAuthMethod()} ${this.getKeyOrToken()}`;
        }

        throw new Error("Auth method has not been specified.");
    }
}

export { Auth };

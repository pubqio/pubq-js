import { comonOptions } from "./types/comonOptions";
declare class Auth {
    private options;
    constructor(options: comonOptions);
    getAuthMethod(): false | "Bearer" | "Basic";
    private getKeyOrToken;
    getKey(): string;
    getKeyBase64(): string;
    makeAuthorizationHeader(): string;
}
export { Auth };

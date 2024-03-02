import { Auth } from "./Auth";
import { CommonOptions } from "./types/CommonOptions";
declare class App {
    private static instance;
    private id;
    constructor();
    static getInstance(): App;
    getId(): string | undefined;
    setId(id: string | undefined): void;
    extractAndSetId(publicKey: string): string | undefined;
    handleAppId(options: CommonOptions, auth: Auth): void;
    destroy(): void;
}
export { App };

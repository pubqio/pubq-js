declare class App {
    private static instance;
    private options;
    private id;
    private auth;
    constructor();
    static getInstance(): App;
    getId(): string | undefined;
    setId(id: string | undefined): void;
    extractAndSetId(publicKey: string): string | undefined;
    handleAppId(): void;
    destroy(): void;
}
export { App };

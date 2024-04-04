import { CommonOptions } from "./types/CommonOptions";
export declare namespace Pubq {
    class RealTime {
        private optionsManager;
        options: CommonOptions;
        auth: any;
        connection: any;
        channels: any;
        app: any;
        constructor(options: CommonOptions);
        updateOptions(options: CommonOptions): void;
        destroy(): void;
    }
}

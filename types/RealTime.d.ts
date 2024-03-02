import { CommonOptions } from "./types/CommonOptions";
export declare namespace Pubq {
    class RealTime {
        options: CommonOptions;
        auth: any;
        connection: any;
        channels: any;
        app: any;
        constructor(options: Partial<CommonOptions>);
        updateOptions(options: Partial<CommonOptions>): void;
        destroy(): void;
    }
}

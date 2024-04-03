import { CommonOptions } from "./types/CommonOptions";
declare class OptionsManager {
    private static instance;
    private options;
    private constructor();
    static getInstance(options?: CommonOptions): OptionsManager;
    get(): CommonOptions;
    static destroy(): void;
}
export { OptionsManager };

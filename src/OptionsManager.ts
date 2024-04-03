import { CommonOptions } from "./types/CommonOptions";
import { DefaultCommonOptions } from "./defaults/DefaultCommonOptions";
import { DefaultPrivateOptions } from "./defaults/DefaultPrivateOptions";

class OptionsManager {
    private static instance: OptionsManager;

    private options: CommonOptions;

    private constructor(options: CommonOptions) {
        this.options = {
            ...DefaultCommonOptions,
            ...options,
            ...DefaultPrivateOptions,
        };
    }

    public static getInstance(options?: CommonOptions): OptionsManager {
        if (!this.instance && options) {
            this.instance = new OptionsManager(options);
        }

        return this.instance;
    }

    public get(): CommonOptions {
        return this.options;
    }

    public static destroy() {
        // Use type assertion to set instance to undefined
        (this.instance as any) = undefined;
    }
}

export { OptionsManager };

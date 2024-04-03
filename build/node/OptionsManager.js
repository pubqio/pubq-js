import { DefaultCommonOptions } from "./defaults/DefaultCommonOptions";
import { DefaultPrivateOptions } from "./defaults/DefaultPrivateOptions";
class OptionsManager {
    static instance;
    options;
    constructor(options) {
        this.options = {
            ...DefaultCommonOptions,
            ...options,
            ...DefaultPrivateOptions,
        };
    }
    static getInstance(options) {
        if (!this.instance && options) {
            this.instance = new OptionsManager(options);
        }
        return this.instance;
    }
    get() {
        return this.options;
    }
    static destroy() {
        // Use type assertion to set instance to undefined
        this.instance = undefined;
    }
}
export { OptionsManager };

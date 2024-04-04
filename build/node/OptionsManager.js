"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionsManager = void 0;
const DefaultCommonOptions_1 = require("./defaults/DefaultCommonOptions");
const DefaultPrivateOptions_1 = require("./defaults/DefaultPrivateOptions");
class OptionsManager {
    static instance;
    options;
    constructor(options) {
        this.options = {
            ...DefaultCommonOptions_1.DefaultCommonOptions,
            ...options,
            ...DefaultPrivateOptions_1.DefaultPrivateOptions,
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
exports.OptionsManager = OptionsManager;

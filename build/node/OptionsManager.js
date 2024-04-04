"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionsManager = void 0;
var DefaultCommonOptions_1 = require("./defaults/DefaultCommonOptions");
var DefaultPrivateOptions_1 = require("./defaults/DefaultPrivateOptions");
var OptionsManager = /** @class */ (function () {
    function OptionsManager(options) {
        this.options = __assign(__assign(__assign({}, DefaultCommonOptions_1.DefaultCommonOptions), options), DefaultPrivateOptions_1.DefaultPrivateOptions);
    }
    OptionsManager.getInstance = function (options) {
        if (!this.instance && options) {
            this.instance = new OptionsManager(options);
        }
        return this.instance;
    };
    OptionsManager.prototype.get = function () {
        return this.options;
    };
    OptionsManager.destroy = function () {
        // Use type assertion to set instance to undefined
        this.instance = undefined;
    };
    return OptionsManager;
}());
exports.OptionsManager = OptionsManager;

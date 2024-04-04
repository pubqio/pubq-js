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
exports.ConnectionManager = void 0;
var ConnectionManager = /** @class */ (function () {
    function ConnectionManager() {
        this.previousState = "initialized";
        this.currentState = "initialized";
    }
    ConnectionManager.prototype.stateChangeObject = function (state, event, reason) {
        var previousState = this.currentState;
        this.currentState = state;
        this.previousState = previousState;
        return __assign(__assign({ current: state, previous: this.previousState }, (event !== undefined && { event: event })), (reason !== undefined && { reason: reason }));
    };
    return ConnectionManager;
}());
exports.ConnectionManager = ConnectionManager;

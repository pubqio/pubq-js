"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionManager = void 0;
class ConnectionManager {
    previousState = "initialized";
    currentState = "initialized";
    constructor() { }
    stateChangeObject(state, event, reason) {
        const previousState = this.currentState;
        this.currentState = state;
        this.previousState = previousState;
        return {
            current: state,
            previous: this.previousState,
            ...(event !== undefined && { event }),
            ...(reason !== undefined && { reason }),
        };
    }
}
exports.ConnectionManager = ConnectionManager;

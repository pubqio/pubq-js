"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelManager = void 0;
class ChannelManager {
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
exports.ChannelManager = ChannelManager;

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
export { ConnectionManager };

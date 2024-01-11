class Message {
    id;
    clientId;
    connectionId;
    data;
    constructor(msg) {
        this.id = msg.id;
        this.clientId = msg.clientId;
        this.connectionId = msg.connectionId;
        this.data = msg.data;
    }
    toObject() {
        const obj = {};
        if (this.id !== undefined) {
            obj.id = this.id;
        }
        if (this.clientId !== undefined) {
            obj.clientId = this.clientId;
        }
        if (this.connectionId !== undefined) {
            obj.connectionId = this.connectionId;
        }
        if (this.data !== undefined) {
            obj.data = this.data;
        }
        return obj;
    }
}
export { Message };

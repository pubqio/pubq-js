"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
var Message = /** @class */ (function () {
    function Message(msg) {
        this.id = msg.id;
        this.clientId = msg.clientId;
        this.connectionId = msg.connectionId;
        this.data = msg.data;
        this.channel = msg.channel;
    }
    Message.prototype.toObject = function () {
        var obj = {};
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
        if (this.channel !== undefined) {
            obj.channel = this.channel;
        }
        return obj;
    };
    return Message;
}());
exports.Message = Message;

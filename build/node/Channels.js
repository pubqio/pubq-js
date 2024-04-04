"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channels = void 0;
const RESTChannel_1 = require("./RESTChannel");
const RealTimeChannel_1 = require("./RealTimeChannel");
class Channels {
    creatorClassName;
    channelsMap = new Map();
    constructor(creatorClassName) {
        this.creatorClassName = creatorClassName;
    }
    get(channelName) {
        if (!this.channelsMap.has(channelName)) {
            // Check if it's a RealTime or REST interface
            if (this.creatorClassName === "RealTime") {
                this.channelsMap.set(channelName, new RealTimeChannel_1.RealTimeChannel(channelName));
            }
            else {
                this.channelsMap.set(channelName, new RESTChannel_1.RESTChannel(channelName));
            }
        }
        return this.channelsMap.get(channelName);
    }
}
exports.Channels = Channels;

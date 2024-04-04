"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channels = void 0;
var RESTChannel_1 = require("./RESTChannel");
var RealTimeChannel_1 = require("./RealTimeChannel");
var Channels = /** @class */ (function () {
    function Channels(creatorClassName) {
        this.channelsMap = new Map();
        this.creatorClassName = creatorClassName;
    }
    Channels.prototype.get = function (channelName) {
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
    };
    return Channels;
}());
exports.Channels = Channels;

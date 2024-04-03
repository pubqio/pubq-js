import { RESTChannel } from "./RESTChannel";
import { RealTimeChannel } from "./RealTimeChannel";

class Channels {
    private creatorClassName: string;
    private channelsMap = new Map();

    constructor(creatorClassName: string) {
        this.creatorClassName = creatorClassName;
    }

    get(channelName: string) {
        if (!this.channelsMap.has(channelName)) {
            // Check if it's a RealTime or REST interface
            if (this.creatorClassName === "RealTime") {
                this.channelsMap.set(channelName, new RealTimeChannel(channelName));
            } else {
                this.channelsMap.set(channelName, new RESTChannel(channelName));
            }
        }

        return this.channelsMap.get(channelName);
    }
}

export { Channels };

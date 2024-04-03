declare class Channels {
    private creatorClassName;
    private channelsMap;
    constructor(creatorClassName: string);
    get(channelName: string): any;
}
export { Channels };

import { Option } from "interfaces/option.interface";
import { OptionManager } from "./option-manager";
import { uuidv7 } from "utils/uuid";
import { RestChannelManager } from "./channel-manager";

export class Rest {
    private instanceId: string;
    public optionManager: OptionManager;
    public channels: RestChannelManager;

    constructor(options?: Partial<Option>) {
        this.instanceId = `rest_${uuidv7()}`;
        this.optionManager = OptionManager.getInstance(this.instanceId, options);
        this.channels = RestChannelManager.getInstance(this.instanceId);
    }

    public reset(): void {
        this.channels.reset();
        this.optionManager.reset();
    }
}

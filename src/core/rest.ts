import { Option } from "interfaces/option.interface";
import { OptionManager } from "./option-manager";
import { uuidv7 } from "utils/uuid";

export class Rest {
    private instanceId: string;
    public optionManager: OptionManager;

    constructor(option?: Partial<Option>) {
        this.instanceId = `rest_${uuidv7()}`;
        this.optionManager = OptionManager.getInstance(this.instanceId, option);
    }

    public reset(): void {
        this.optionManager.reset();
    }
}

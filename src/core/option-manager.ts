import { DEFAULT_OPTIONS, Option } from "interfaces/option.interface";

class OptionManager {
    private static instances: Map<string, OptionManager> = new Map();
    private instanceId: string;
    private option: Option = { ...DEFAULT_OPTIONS };

    private constructor(instanceId: string, options?: Partial<Option>) {
        this.instanceId = instanceId;
        this.option = options
            ? { ...DEFAULT_OPTIONS, ...options }
            : DEFAULT_OPTIONS;
    }

    public static getInstance(
        instanceId: string,
        option?: Partial<Option>
    ): OptionManager {
        if (!OptionManager.instances.has(instanceId)) {
            OptionManager.instances.set(
                instanceId,
                new OptionManager(instanceId, option)
            );
        }
        return OptionManager.instances.get(instanceId)!;
    }

    public getOption(): Option;
    public getOption<K extends keyof Option>(optionName: K): Option[K];
    public getOption<K extends keyof Option>(optionName?: K) {
        return optionName ? this.option[optionName] : this.option;
    }

    public setOption(newOption: Partial<Option>): void {
        this.option = { ...this.option, ...newOption };
    }

    public reset(): void {
        OptionManager.instances.delete(this.instanceId);
    }
}

export { OptionManager };

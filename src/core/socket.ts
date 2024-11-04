import { Option } from "interfaces/option.interface";
import { Connection } from "./connection";
import { OptionManager } from "./option-manager";
import { uuidv7 } from "utils/uuid";
import { AuthManager } from "./auth-manager";

export class Socket {
    private instanceId: string;
    public optionManager: OptionManager;
    public authManager: AuthManager;
    public connection: Connection;

    constructor(options?: Partial<Option>) {
        this.instanceId = `socket_${uuidv7()}`;
        this.optionManager = OptionManager.getInstance(
            this.instanceId,
            options
        );
        this.authManager = AuthManager.getInstance(this.instanceId);
        this.connection = Connection.getInstance(this.instanceId);

        if (this.optionManager.getOption("autoConnect")) {
            this.connection.connect();
        }
    }

    public reset(): void {
        this.connection.reset();
        this.authManager.reset();
        this.optionManager.reset();
    }
}

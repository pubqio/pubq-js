import { Option } from "interfaces/option.interface";
import { Connection } from "./connection";
import { OptionManager } from "./option-manager";
import { uuidv7 } from "utils/uuid";
import { AuthManager } from "./auth-manager";
import { SocketChannelManager } from "./channel-manager";

export class Socket {
    private instanceId: string;
    public optionManager: OptionManager;
    public authManager: AuthManager;
    public connection: Connection;
    public channels: SocketChannelManager;

    constructor(options?: Partial<Option>) {
        this.instanceId = `socket_${uuidv7()}`;
        this.optionManager = OptionManager.getInstance(
            this.instanceId,
            options
        );
        this.authManager = AuthManager.getInstance(this.instanceId);
        this.connection = Connection.getInstance(this.instanceId);
        this.channels = SocketChannelManager.getInstance(this.instanceId);

        if (this.optionManager.getOption("autoConnect")) {
            this.connection.connect();
        }
    }

    public reset(): void {
        this.channels.reset();
        this.connection.reset();
        this.authManager.reset();
        this.optionManager.reset();
    }
}

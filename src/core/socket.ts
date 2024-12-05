import { Option } from "interfaces/option.interface";
import { Connection } from "./connection";
import { OptionManager } from "./option-manager";
import { uuidv7 } from "utils/uuid";
import { AuthManager } from "./auth-manager";
import { SocketChannelManager } from "./channel-manager";
import { Logger } from "utils/logger";

export class Socket {
    private instanceId: string;
    public optionManager: OptionManager;
    public authManager: AuthManager;
    public connection: Connection;
    public channels: SocketChannelManager;
    private logger: Logger;

    constructor(options?: Partial<Option>) {
        this.instanceId = `socket_${uuidv7()}`;
        this.optionManager = OptionManager.getInstance(
            this.instanceId,
            options
        );
        this.logger = new Logger(this.instanceId, "Socket");

        this.logger.debug("Initializing Socket instance");

        this.authManager = AuthManager.getInstance(this.instanceId);
        this.connection = Connection.getInstance(this.instanceId);
        this.channels = SocketChannelManager.getInstance(this.instanceId);

        if (this.optionManager.getOption("autoConnect")) {
            this.logger.info("Auto-connecting socket");
            this.connection.connect();
        }

        this.logger.info("Socket instance created");
    }

    public reset(): void {
        this.channels.reset();
        this.connection.reset();
        this.authManager.reset();
        this.optionManager.reset();
    }
}

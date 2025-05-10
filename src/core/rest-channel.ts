import { ChannelEvents } from "types/event.type";
import { AuthManager } from "./auth-manager";
import { BaseChannel } from "./channel";
import { HttpClient } from "./http-client";
import { OptionManager } from "./option-manager";
import { RestPublishRequest } from "interfaces/message.interface";

export class RestChannel extends BaseChannel {
    private httpClient: HttpClient;
    private authManager: AuthManager;
    private optionManager: OptionManager;

    constructor(
        name: string,
        httpClient: HttpClient,
        authManager: AuthManager,
        optionManager: OptionManager
    ) {
        super(name);
        this.httpClient = httpClient;
        this.authManager = authManager;
        this.optionManager = optionManager;
    }

    public async publish(payload: any, event?: string, clientId?: string): Promise<void> {
        try {
            const headers = this.authManager.getAuthHeaders();
            const host = this.optionManager.getOption("httpHost");
            const port = this.optionManager.getOption("httpPort");
            const isSecure = this.optionManager.getOption("isSecure");
            const protocol = isSecure ? "https" : "http";
            const url = `${protocol}://${host}${
                port ? `:${port}` : ""
            }/v1/channel/${this.name}/messages`;
    
            const requestPayload: RestPublishRequest = {
                channels: [this.name],
                data: payload,
                event,
                clientId
            };
    
            await this.httpClient.post(url, requestPayload, headers);
        } catch (error) {
            this.emit(ChannelEvents.FAILED, error);
            throw error;
        }
    }

    public reset(): void {
        this.removeAllListeners();
    }
}

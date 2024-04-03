import { CommonOptions } from "./types/CommonOptions";
import { Auth } from "./Auth";
import { TokenOptions } from "./types/TokenOptions";
import { Channels } from "./Channels";
export declare namespace Pubq {
    class REST {
        private options;
        private http;
        private client;
        private version;
        auth: Auth;
        channels: Channels;
        constructor(options: CommonOptions, auth?: Auth);
        generateToken(options: TokenOptions | undefined): Promise<any>;
        refreshToken(token: string): Promise<any>;
        revokeToken(token: string): Promise<any>;
    }
}

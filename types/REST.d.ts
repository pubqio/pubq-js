import { CommonOptions } from "./types/CommonOptions";
import { Auth } from "./Auth";
import { TokenOptions } from "./types/TokenOptions";
export declare namespace Pubq {
    class REST {
        private options;
        private http;
        private client;
        private version;
        auth: Auth;
        constructor(options: Partial<CommonOptions>, auth?: Auth);
        publish(channel: string, data: string | any[]): Promise<any>;
        generateToken(options: TokenOptions | undefined): Promise<any>;
        refreshToken(token: string): Promise<any>;
        revokeToken(token: string): Promise<any>;
    }
}

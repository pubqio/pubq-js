import { comonOptions } from "./types/comonOptions";
import { Auth } from "./auth";
export declare namespace Pubq {
    class REST {
        private options;
        private http;
        private client;
        private version;
        auth: Auth;
        private refreshTokenIntervalId;
        constructor(options: Partial<comonOptions>, auth?: Auth);
        publish(channel: string, data: string | any[]): Promise<any>;
        generateToken(clientId: string | undefined): Promise<any>;
        refreshToken(token: string): Promise<any>;
        revokeToken(token: string): Promise<any>;
        requestToken(): Promise<any>;
        requestRefresh(): Promise<any>;
        requestRevoke(): Promise<any>;
        startRefreshTokenInterval(): void;
        stopRefreshTokenInterval(): void;
    }
}

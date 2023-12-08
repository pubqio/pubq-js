import { comonOptions } from "./types/comonOptions";
export declare namespace Pubq {
    class RealTime {
        private options;
        private ws;
        private socket;
        private auth;
        private rest;
        private applicationId;
        CONNECTING: string;
        OPEN: string;
        CLOSED: string;
        AUTHENTICATED: string;
        UNAUTHENTICATED: string;
        SUBSCRIBED: string;
        PENDING: string;
        UNSUBSCRIBED: string;
        constructor(options: Partial<comonOptions>);
        create(): void;
        connect(): any;
        disconnect(): any;
        getState(): any;
        isAuthenticated(): any;
        basicAuth(): void;
        authenticate(body?: object, headers?: object): Promise<void>;
        deauthenticate(): any;
        subscribe(channelName: string): any;
        unsubscribe(channelName: string): any;
        subscriptions(includePending?: boolean): any;
        isSubscribed(channelName: string, includePending?: boolean): any;
        channel(channelName: string): any;
        closeChannel(channelName: string): any;
        closeAllChannels(): any;
        killChannel(channelName: string): any;
        killAllChannels(): any;
        listener(eventName: string): any;
        closeListener(eventName: string): any;
        closeAllListeners(): any;
        killListener(eventName: string): any;
        killAllListeners(): any;
        requestToken(): Promise<any>;
        requestRefresh(): Promise<any>;
        requestRevoke(): Promise<any>;
        startRefreshTokenInterval(): void;
        stopRefreshTokenInterval(): void;
    }
}

import { comonOptions } from "./types/comonOptions";
import { defaultComonOptions } from "./defaults/defaultComonOptions";
import { defaultPrivateOptions } from "./defaults/defaultPrivateOptions";
import { WebSocket } from "./websocket";
import { Auth } from "./auth";
import { REST } from "./rest";

class RealTime {
    private options: comonOptions;

    private ws;

    private socket;

    private auth;

    private rest;

    private applicationId: string | undefined;

    public CONNECTING: string;
    public OPEN: string;
    public CLOSED: string;
    public AUTHENTICATED: string;
    public UNAUTHENTICATED: string;
    public SUBSCRIBED: string;
    public PENDING: string;
    public UNSUBSCRIBED: string;

    constructor(options: Partial<comonOptions>) {
        this.options = {
            ...defaultComonOptions,
            ...options,
            ...defaultPrivateOptions,
        };

        this.ws = new WebSocket();

        this.socket = this.ws.getClient();

        this.auth = new Auth(this.options);

        this.rest = new REST(this.options, this.auth);

        this.CONNECTING = "connecting";
        this.OPEN = "open";
        this.CLOSED = "closed";

        this.AUTHENTICATED = "authenticated";
        this.UNAUTHENTICATED = "unauthenticated";

        this.SUBSCRIBED = "subscribed";
        this.PENDING = "pending";
        this.UNSUBSCRIBED = "unsubscribed";

        if (this.options.autoConnect) {
            this.create();
        }
    }

    create() {
        this.socket = this.socket.create(this.options);

        (async () => {
            for await (let event of this.socket.listener("connect")) {
                if (this.options.autoAuthenticate) {
                    if (!event.isAuthenticated) {
                        this.authenticate();
                    }
                }
            }
        })();

        (async () => {
            for await (let event of this.socket.listener("authenticate")) {
                if (typeof this.applicationId === "undefined") {
                    const [appId] = event.authToken.sub.split(".");
                    this.applicationId = appId;
                }
            }
        })();

        (async () => {
            for await (let event of this.socket.listener("deauthenticate")) {
                if (this.options.autoAuthenticate) {
                    this.authenticate();
                }
            }
        })();
    }

    connect() {
        return this.socket.connect();
    }

    disconnect() {
        return this.socket.disconnect();
    }

    getState() {
        return this.socket.getState();
    }

    isAuthenticated() {
        return this.socket.isAuthenticated();
    }

    basicAuth() {
        this.socket.invoke("#basicAuth", {
            key: this.auth.getKey(),
        });
    }

    async authenticate(body: object = {}, headers: object = {}) {
        const authMethod = this.auth.getAuthMethod();

        if (authMethod === "Basic") {
            this.basicAuth();
        } else if (authMethod === "Bearer") {
            const response: any = await this.requestToken();
            if (response) {
                await this.disconnect();
                this.connect();
            }
        }
    }

    deauthenticate() {
        this.requestRevoke();
        return this.socket.deauthenticate();
    }

    subscribe(channelName: string) {
        return this.socket.subscribe(`${this.applicationId}/${channelName}`);
    }

    unsubscribe(channelName: string) {
        return this.socket.unsubscribe(`${this.applicationId}/${channelName}`);
    }

    subscriptions(includePending = false) {
        return this.socket.subscriptions(includePending);
    }

    isSubscribed(channelName: string, includePending = false) {
        return this.socket.isSubscribed(
            `${this.applicationId}/${channelName}`,
            includePending
        );
    }

    channel(channelName: string) {
        return this.socket.channel(`${this.applicationId}/${channelName}`);
    }

    closeChannel(channelName: string) {
        return this.socket.closeChannel(`${this.applicationId}/${channelName}`);
    }

    closeAllChannels() {
        return this.socket.closeAllChannels();
    }

    killChannel(channelName: string) {
        return this.socket.killChannel(`${this.applicationId}/${channelName}`);
    }

    killAllChannels() {
        return this.socket.killAllChannels();
    }

    listener(eventName: string) {
        return this.socket.listener(eventName);
    }

    closeListener(eventName: string) {
        return this.socket.closeListener(eventName);
    }

    closeAllListeners() {
        return this.socket.closeAllListeners();
    }

    killListener(eventName: string) {
        return this.socket.killListener(eventName);
    }

    killAllListeners() {
        return this.socket.killAllListeners();
    }

    requestToken() {
        return this.rest.requestToken();
    }

    requestRefresh() {
        return this.rest.requestRefresh();
    }

    requestRevoke() {
        return this.rest.requestRevoke();
    }
}

export { RealTime };

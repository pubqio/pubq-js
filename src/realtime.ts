const _ = require("lodash");
const socketClusterClient = require("socketcluster-client");

class RealTime {
    private applicationKey: string;
    private applicationId: string | null;

    private options: any;

    private socket: any;

    public CONNECTING: string;
    public OPEN: string;
    public CLOSED: string;
    public AUTHENTICATED: string;
    public UNAUTHENTICATED: string;
    public SUBSCRIBED: string;
    public PENDING: string;
    public UNSUBSCRIBED: string;

    constructor(applicationKey: string, options = {}) {
        this.applicationKey = applicationKey;
        this.applicationId = null;

        this.socket = null;

        this.CONNECTING = "connecting";
        this.OPEN = "open";
        this.CLOSED = "closed";

        this.AUTHENTICATED = "authenticated";
        this.UNAUTHENTICATED = "unauthenticated";

        this.SUBSCRIBED = "subscribed";
        this.PENDING = "pending";
        this.UNSUBSCRIBED = "unsubscribed";

        let defaultOptions = {
            autoConnect: true,
            autoReconnect: true,
            autoSubscribeOnConnect: true,
            connectTimeout: 20000,
            ackTimeout: 10000,
            timestampRequests: false,
            timestampParam: "t",
            authTokenName: "pubq.authToken",
            binaryType: "arraybuffer",
            batchOnHandshake: false,
            batchOnHandshakeDuration: 100,
            batchInterval: 50,
            protocolVersion: 2,
            wsOptions: {},
            cloneData: false,
        };

        const privateOptions = {
            hostname: "realtime.pubq.io",
            secure: true,
            port: 443,
            path: "/",
        };

        this.options = _.merge(defaultOptions, options, privateOptions);

        if (this.options.autoConnect) {
            this.create();
        }
    }

    create() {
        this.socket = socketClusterClient.create(this.options);

        (async () => {
            for await (let event of this.socket.listener("connect")) {
                if (!event.isAuthenticated) {
                    this.login();
                }
            }
        })();

        (async () => {
            for await (let event of this.socket.listener("authenticate")) {
                const [appId] = event.authToken.public_key.split(".");
                this.applicationId = appId;
            }
        })();

        (async () => {
            for await (let event of this.socket.listener("deauthenticate")) {
                this.login();
            }
        })();
    }

    login() {
        this.socket.invoke("#login", {
            authorization: `Basic ${Buffer.from(this.applicationKey).toString(
                "base64"
            )}`,
        });
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

    deauthenticate() {
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
}

export { RealTime };
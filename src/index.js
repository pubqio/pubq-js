const _ = require("lodash");
const socketClusterClient = require("socketcluster-client/socketcluster-client");

class Pubq {
    constructor(applicationKey, options = {}) {
        let defaultOptions = {
            autoConnect: true,
            autoReconnect: true,
            autoSubscribeOnConnect: true,
            connectTimeout: 20000,
            ackTimeout: 10000,
            timestampRequests: false,
            timestampParam: "t",
            authTokenName: process.env.PUBQ_PUBSUB_AUTH_TOKEN_NAME,
            binaryType: "arraybuffer",
            batchOnHandshake: false,
            batchOnHandshakeDuration: 100,
            batchInterval: 50,
            protocolVersion: 2,
            wsOptions: {},
            cloneData: false,
        };

        const privateOptions = {
            hostname: process.env.PUBQ_PUBSUB_HOSTNAME,
            secure: process.env.PUBQ_PUBSUB_SECURE,
            port: process.env.PUBQ_PUBSUB_PORT,
            path: process.env.PUBQ_PUBSUB_PATH,
        };

        this.options = _.merge(defaultOptions, options, privateOptions);

        this.applicationKey = applicationKey;

        this.socket = null;

        if (this.options.autoConnect) {
            this.create();
        }
    }

    create() {
        this.socket = socketClusterClient.create(this.options);

        (async () => {
            for await (let { error } of this.socket.listener("error")) {
                console.error(error);
            }
        })();

        (async () => {
            for await (let event of this.socket.listener("connect")) {
                if (!event.isAuthenticated) {
                    this.socket.invoke("#login", {
                        applicationKey: this.applicationKey,
                    });
                }
            }
        })();

        (async () => {
            for await (let event of this.socket.listener("deauthenticate")) {
                this.socket.invoke("#login", {
                    applicationKey: this.applicationKey,
                });
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

    deauthenticate() {
        return this.socket.deauthenticate();
    }

    subscribe(channelName) {
        return this.socket.subscribe(`${this.applicationKey}/${channelName}`);
    }

    unsubscribe(channelName) {
        return this.socket.unsubscribe(`${this.applicationKey}/${channelName}`);
    }

    subscriptions(includePending = false) {
        return this.socket.subscriptions(includePending);
    }

    isSubscribed(channelName, includePending = false) {
        return this.socket.isSubscribed(
            `${this.applicationKey}/${channelName}`,
            includePending
        );
    }

    channel(channelName) {
        return this.socket.channel(`${this.applicationKey}/${channelName}`);
    }

    closeChannel(channelName) {
        return this.socket.closeChannel(
            `${this.applicationKey}/${channelName}`
        );
    }

    closeAllChannels() {
        return this.socket.closeAllChannels();
    }

    killChannel(channelName) {
        return this.socket.killChannel(`${this.applicationKey}/${channelName}`);
    }

    killAllChannels() {
        return this.socket.killAllChannels();
    }

    listener(eventName) {
        return this.socket.listener(eventName);
    }

    closeListener(eventName) {
        return this.socket.closeListener(eventName);
    }

    closeAllListeners() {
        return this.socket.closeAllListeners();
    }

    killListener(eventName) {
        return this.socket.killListener(eventName);
    }

    killAllListeners() {
        return this.socket.killAllListeners();
    }
}

module.exports = Pubq;

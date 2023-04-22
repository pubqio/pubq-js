const socketClusterClient = require("socketcluster-client/socketcluster-client");

class Pubq {
    constructor(applicationKey) {
        this.applicationKey = applicationKey;
        this.socket = null;
        this.create();
    }

    create() {
        this.socket = socketClusterClient.create({
            hostname: process.env.PUBQ_PUBSUB_HOSTNAME,
            secure: process.env.PUBQ_PUBSUB_SECURE,
            port: process.env.PUBQ_PUBSUB_PORT,
            path: process.env.PUBQ_PUBSUB_PATH,
            authTokenName: process.env.PUBQ_PUBSUB_AUTH_TOKEN_NAME,
        });

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

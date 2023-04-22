const socketClusterClient = require("socketcluster-client/socketcluster-client");

class Pubq {
    constructor(applicationKey) {
        this.applicationKey = applicationKey;
        this.socket = null;
        this.connect();
    }

    connect() {
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

    subscribe(channel) {
        return this.socket.subscribe(`${this.applicationKey}/${channel}`);
    }

    disconnect() {
        this.socket.disconnect();
    }
}

module.exports = Pubq;

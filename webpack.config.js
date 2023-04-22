const path = require("path");
require("dotenv").config();
const webpack = require("webpack");

const environmentVariables = [
    "PUBQ_PUBSUB_HOSTNAME",
    "PUBQ_PUBSUB_SECURE",
    "PUBQ_PUBSUB_PORT",
    "PUBQ_PUBSUB_PATH",
    "PUBQ_PUBSUB_AUTH_TOKEN_NAME",
];

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "pubq.js",
        library: "Pubq",
        libraryTarget: "umd",
        globalObject: 'this',
    },
    plugins: [new webpack.EnvironmentPlugin(environmentVariables)],
    mode: "production",
};

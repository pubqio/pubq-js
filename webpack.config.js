const path = require("path");

module.exports = {
    entry: {
        realtime: "./src/realtime.js",
        rest: "./src/rest.js",
        all: "./src/index.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "pubq-[name].js",
        library: "PUBQ JavaScript SDK",
        libraryTarget: "umd",
        globalObject: "this",
    },
    mode: "production",
};

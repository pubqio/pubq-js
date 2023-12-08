const path = require("path");

module.exports = {
    entry: {
        pubq: "./src/pubq.ts",
    },
    output: {
        path: path.resolve(__dirname, "bundle"),
        filename: "[name].js",
        library: "PUBQ JavaScript SDK",
        libraryTarget: "umd",
        globalObject: "this",
    },
    mode: "production",
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: "ts-loader",
            },
        ],
    },
};

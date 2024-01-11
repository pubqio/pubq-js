const path = require("path");

module.exports = (env, argv) => {
    const isProduction = argv.mode === "production";

    return {
        entry: {
            pubq: "./src/pubq.ts",
        },
        output: {
            path: path.resolve(__dirname, "build/web"),
            filename: isProduction ? "pubq.min.js" : "pubq.js",
            library: "PUBQ",
            libraryTarget: "umd",
            globalObject: "this",
        },
        mode: isProduction ? "production" : "development",
        devtool: isProduction ? "source-map" : "eval-source-map",
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
        optimization: {
            minimize: isProduction,
        },
    };
};

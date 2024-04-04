"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtPayload = exports.getSignedAuthToken = void 0;
const getSignedAuthToken = (authTokenName) => {
    return localStorage.getItem(authTokenName);
};
exports.getSignedAuthToken = getSignedAuthToken;
const getJwtPayload = (token) => {
    if (token) {
        // Split the JWT into its three parts: header, payload, and signature
        const parts = token.split(".");
        // Ensure there are three parts
        if (parts.length !== 3) {
            throw new Error("Invalid JWT format");
        }
        // Decode the Base64-encoded payload
        const decodedPayload = atob(parts[1]);
        // Parse the JSON payload
        const parsedPayload = JSON.parse(decodedPayload);
        return parsedPayload;
    }
};
exports.getJwtPayload = getJwtPayload;

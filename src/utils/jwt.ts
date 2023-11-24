export const getSignedAuthToken = (authTokenName: string) => {
    return localStorage.getItem(authTokenName);
};

export const getJwtPayload = (token: string | null) => {
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

import axios from "axios";

export default class REST {
    constructor(applicationKey) {
        this.applicationKey = applicationKey;

        this.httpClient = axios.create({
            baseURL: "https://rest.pubq.io",
        });
    }

    async publish(channel, data) {
        try {
            const response = await this.httpClient.post(
                "/v1/messages/publish",
                { channel, data },
                {
                    headers: {
                        Authorization: `Basic ${Buffer.from(
                            this.applicationKey
                        ).toString("base64")}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error("Error publishing message:", error);
            throw error;
        }
    }
}

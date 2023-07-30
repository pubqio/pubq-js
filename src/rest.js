import axios from "axios";

export default class REST {
    constructor(applicationId, applicationKey, applicationSecret) {
        this.applicationId = applicationId;
        this.applicationKey = applicationKey;
        this.applicationSecret = applicationSecret;

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
                        Id: this.applicationId,
                        Key: this.applicationKey,
                        Secret: this.applicationSecret,
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

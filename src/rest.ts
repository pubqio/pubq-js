import axios, { AxiosInstance } from "axios";

class REST {
    private applicationKey: string;

    private httpClient: AxiosInstance;

    constructor(applicationKey: string) {
        this.applicationKey = applicationKey;

        this.httpClient = axios.create({
            baseURL: "https://rest.pubq.io",
        });
    }

    public async publish(channel: string, data: string | any[]): Promise<any> {
        const response = await this.httpClient.post(
            "/v1/channels/messages",
            {
                channel,
                data,
            },
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        this.applicationKey
                    ).toString("base64")}`,
                },
            }
        );

        return response.data;
    }
}

export { REST };

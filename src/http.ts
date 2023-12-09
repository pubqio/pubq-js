import axios, { AxiosInstance } from "axios";

class Http {
    private baseUrl = "https://rest.pubq.io";

    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: this.baseUrl,
        });
    }

    getClient() {
        return this.client;
    }
}

export { Http };

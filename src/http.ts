import { comonOptions } from "./types/comonOptions";
import axios, { AxiosInstance } from "axios";

class Http {
    private options: comonOptions;

    private baseURL = "rest.pubq.io";

    private client: AxiosInstance;

    constructor(options: comonOptions) {
        this.options = options;

        this.client = axios.create({
            baseURL: `https://${this.baseURL}`,
        });
    }

    getClient() {
        return this.client;
    }
}

export { Http };

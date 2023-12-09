import { AxiosInstance } from "axios";
declare class Http {
    private baseUrl;
    private client;
    constructor();
    getClient(): AxiosInstance;
}
export { Http };

import axios from "axios";
class Http {
    baseUrl = "https://rest.pubq.io";
    client;
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

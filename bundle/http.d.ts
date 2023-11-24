import { comonOptions } from "./types/comonOptions";
import { AxiosInstance } from "axios";
declare class Http {
    private options;
    private baseURL;
    private client;
    constructor(options: comonOptions);
    getClient(): AxiosInstance;
}
export { Http };

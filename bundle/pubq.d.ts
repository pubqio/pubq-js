import * as RealTimeModule from "./realtime";
import * as RESTModule from "./rest";
export declare namespace Pubq {
    export import RealTime = RealTimeModule.Pubq.RealTime;
    export import REST = RESTModule.Pubq.REST;
}
declare global {
    interface Window {
        Pubq: typeof Pubq;
    }
}

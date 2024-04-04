import * as RealTimeModule from "./RealTime";
import * as RESTModule from "./REST";
export declare namespace Pubq {
    export import RealTime = RealTimeModule.Pubq.RealTime;
    export import REST = RESTModule.Pubq.REST;
}
declare global {
    interface Window {
        Pubq: typeof Pubq;
    }
}
export default Pubq;

import * as RealTimeModule from "./RealTime";
import * as RESTModule from "./REST";

export namespace Pubq {
    export import RealTime = RealTimeModule.Pubq.RealTime;
    export import REST = RESTModule.Pubq.REST;
}

declare global {
    interface Window {
        Pubq: typeof Pubq;
    }
}

if (typeof window !== "undefined") {
    window.Pubq = Pubq;
}

export default Pubq;

import * as RealTimeModule from "./realtime";
import * as RESTModule from "./rest";

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

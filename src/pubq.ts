import * as RealTimeModule from "./RealTime";
import * as RESTModule from "./REST";

// Define the namespace Pubq with its interfaces
export namespace Pubq {
    export import RealTime = RealTimeModule.Pubq.RealTime;
    export import REST = RESTModule.Pubq.REST;
}

// Extend the global Window interface to include Pubq
declare global {
    interface Window {
        Pubq: typeof Pubq;
    }
}

if (typeof window !== "undefined") {
    window.Pubq = Pubq;
}

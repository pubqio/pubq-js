import * as RealTimeModule from "./RealTime";
import * as RESTModule from "./REST";
// Define the namespace Pubq with its interfaces
export var Pubq;
(function (Pubq) {
    Pubq.RealTime = RealTimeModule.Pubq.RealTime;
    Pubq.REST = RESTModule.Pubq.REST;
})(Pubq || (Pubq = {}));
if (typeof window !== "undefined") {
    window.Pubq = Pubq;
}

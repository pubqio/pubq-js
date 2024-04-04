import * as RealTimeModule from "./RealTime";
import * as RESTModule from "./REST";
export var Pubq;
(function (Pubq) {
    Pubq.RealTime = RealTimeModule.Pubq.RealTime;
    Pubq.REST = RESTModule.Pubq.REST;
})(Pubq || (Pubq = {}));
if (typeof window !== "undefined") {
    window.Pubq = Pubq;
}
export default Pubq;

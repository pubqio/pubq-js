"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealTimeChannel = void 0;
var App_1 = require("./App");
var DefaultChannelEvents_1 = require("./defaults/DefaultChannelEvents");
var WebSocket_1 = require("./WebSocket");
var ChannelManager_1 = require("./ChannelManager");
var Message_1 = require("./Message");
var OptionsManager_1 = require("./OptionsManager");
var EventEmitter = require("eventemitter3");
var RealTimeChannel = /** @class */ (function () {
    function RealTimeChannel(channelName) {
        this.channel = null;
        this.channelName = null;
        this.events = new EventEmitter();
        this.manager = new ChannelManager_1.ChannelManager();
        this.options = OptionsManager_1.OptionsManager.getInstance().get();
        this.ws = WebSocket_1.WebSocket.getInstance();
        this.app = App_1.App.getInstance();
        this.channelName = channelName;
        this.init();
    }
    Object.defineProperty(RealTimeChannel.prototype, "state", {
        get: function () {
            return this.manager.currentState;
        },
        enumerable: false,
        configurable: true
    });
    RealTimeChannel.prototype.init = function () {
        var socket = this.ws.getSocket();
        this.channel = socket.channel("".concat(this.app.getId(), "/").concat(this.channelName));
        this.handleSubscribeEvent();
        this.handleUnsubscribeEvent();
        this.handleSubscribeFailEvent();
    };
    RealTimeChannel.prototype.handleSubscribeEvent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, _c, event_1, e_1_1;
                        var _d, e_1, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    _g.trys.push([0, 5, 6, 11]);
                                    _a = true, _b = __asyncValues(this.channel.listener("subscribe"));
                                    _g.label = 1;
                                case 1: return [4 /*yield*/, _b.next()];
                                case 2:
                                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 4];
                                    _f = _c.value;
                                    _a = false;
                                    event_1 = _f;
                                    this.events.emit("subscribed", this.manager.stateChangeObject("subscribed"));
                                    resolve();
                                    _g.label = 3;
                                case 3:
                                    _a = true;
                                    return [3 /*break*/, 1];
                                case 4: return [3 /*break*/, 11];
                                case 5:
                                    e_1_1 = _g.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 11];
                                case 6:
                                    _g.trys.push([6, , 9, 10]);
                                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 8];
                                    return [4 /*yield*/, _e.call(_b)];
                                case 7:
                                    _g.sent();
                                    _g.label = 8;
                                case 8: return [3 /*break*/, 10];
                                case 9:
                                    if (e_1) throw e_1.error;
                                    return [7 /*endfinally*/];
                                case 10: return [7 /*endfinally*/];
                                case 11: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    RealTimeChannel.prototype.handleUnsubscribeEvent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, _c, event_2, e_2_1;
                        var _d, e_2, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    _g.trys.push([0, 5, 6, 11]);
                                    _a = true, _b = __asyncValues(this.channel.listener("unsubscribe"));
                                    _g.label = 1;
                                case 1: return [4 /*yield*/, _b.next()];
                                case 2:
                                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 4];
                                    _f = _c.value;
                                    _a = false;
                                    event_2 = _f;
                                    this.events.emit("unsubscribed", this.manager.stateChangeObject("unsubscribed"));
                                    resolve();
                                    _g.label = 3;
                                case 3:
                                    _a = true;
                                    return [3 /*break*/, 1];
                                case 4: return [3 /*break*/, 11];
                                case 5:
                                    e_2_1 = _g.sent();
                                    e_2 = { error: e_2_1 };
                                    return [3 /*break*/, 11];
                                case 6:
                                    _g.trys.push([6, , 9, 10]);
                                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 8];
                                    return [4 /*yield*/, _e.call(_b)];
                                case 7:
                                    _g.sent();
                                    _g.label = 8;
                                case 8: return [3 /*break*/, 10];
                                case 9:
                                    if (e_2) throw e_2.error;
                                    return [7 /*endfinally*/];
                                case 10: return [7 /*endfinally*/];
                                case 11: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    RealTimeChannel.prototype.handleSubscribeFailEvent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var socket;
            var _this = this;
            return __generator(this, function (_a) {
                socket = this.ws.getSocket();
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, _c, error, e_3_1;
                        var _d, e_3, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    _g.trys.push([0, 5, 6, 11]);
                                    _a = true, _b = __asyncValues(socket.listener("subscribeFail"));
                                    _g.label = 1;
                                case 1: return [4 /*yield*/, _b.next()];
                                case 2:
                                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 4];
                                    _f = _c.value;
                                    _a = false;
                                    error = _f;
                                    this.events.emit("failed", this.manager.stateChangeObject("failed", "failed", error));
                                    resolve();
                                    _g.label = 3;
                                case 3:
                                    _a = true;
                                    return [3 /*break*/, 1];
                                case 4: return [3 /*break*/, 11];
                                case 5:
                                    e_3_1 = _g.sent();
                                    e_3 = { error: e_3_1 };
                                    return [3 /*break*/, 11];
                                case 6:
                                    _g.trys.push([6, , 9, 10]);
                                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 8];
                                    return [4 /*yield*/, _e.call(_b)];
                                case 7:
                                    _g.sent();
                                    _g.label = 8;
                                case 8: return [3 /*break*/, 10];
                                case 9:
                                    if (e_3) throw e_3.error;
                                    return [7 /*endfinally*/];
                                case 10: return [7 /*endfinally*/];
                                case 11: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    RealTimeChannel.prototype.handleChannelDataEvent = function (listener) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, _c, data, msg, e_4_1;
                        var _d, e_4, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    _g.trys.push([0, 5, 6, 11]);
                                    _a = true, _b = __asyncValues(this.channel);
                                    _g.label = 1;
                                case 1: return [4 /*yield*/, _b.next()];
                                case 2:
                                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 4];
                                    _f = _c.value;
                                    _a = false;
                                    data = _f;
                                    msg = new Message_1.Message({
                                        data: data,
                                        channel: this.channel.name,
                                    }).toObject();
                                    listener(msg);
                                    resolve();
                                    _g.label = 3;
                                case 3:
                                    _a = true;
                                    return [3 /*break*/, 1];
                                case 4: return [3 /*break*/, 11];
                                case 5:
                                    e_4_1 = _g.sent();
                                    e_4 = { error: e_4_1 };
                                    return [3 /*break*/, 11];
                                case 6:
                                    _g.trys.push([6, , 9, 10]);
                                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 8];
                                    return [4 /*yield*/, _e.call(_b)];
                                case 7:
                                    _g.sent();
                                    _g.label = 8;
                                case 8: return [3 /*break*/, 10];
                                case 9:
                                    if (e_4) throw e_4.error;
                                    return [7 /*endfinally*/];
                                case 10: return [7 /*endfinally*/];
                                case 11: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    RealTimeChannel.prototype.subscribe = function (arg1, arg2) {
        if (!this.channel) {
            throw new Error("Channel is not specified.");
        }
        var socket = this.ws.getSocket();
        if (socket.isSubscribed("".concat(this.app.getId(), "/").concat(this.channelName), true)) {
            var error = {
                code: 201,
                message: "The channel has already been subscribed.",
            };
            this.events.emit("failed", this.manager.stateChangeObject("failed", "failed", error));
            return false;
        }
        this.events.emit("subscribing", this.manager.stateChangeObject("subscribing"));
        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
        }
        else if (Array.isArray(arg1) && typeof arg2 === "function") {
            // Overload 2
        }
        else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 3
            this.channel.subscribe();
            this.handleChannelDataEvent(arg1);
        }
    };
    RealTimeChannel.prototype.unsubscribe = function (arg1, arg2) {
        if (!this.channel) {
            throw new Error("Channel is not specified.");
        }
        var socket = this.ws.getSocket();
        if (!socket.isSubscribed("".concat(this.app.getId(), "/").concat(this.channelName), true)) {
            var error = {
                code: 203,
                message: "Can not unsubscribe from a channel that is not subscribed.",
            };
            this.events.emit("failed", this.manager.stateChangeObject("failed", "failed", error));
            return false;
        }
        this.events.emit("unsubscribing", this.manager.stateChangeObject("unsubscribing"));
        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
        }
        else if (Array.isArray(arg1) && typeof arg2 === "function") {
            // Overload 2
        }
        else if (typeof arg1 === "string" && arg2 === undefined) {
            // Overload 3
        }
        else if (Array.isArray(arg1) && arg2 === undefined) {
            // Overload 4
        }
        else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 5
        }
        else if (arg1 === undefined && arg2 === undefined) {
            // Overload 6
            socket.unsubscribe("".concat(this.app.getId(), "/").concat(this.channelName));
        }
    };
    RealTimeChannel.prototype.publish = function (data) {
        var socket = this.ws.getSocket();
        socket.transmitPublish("".concat(this.app.getId(), "/").concat(this.channelName), data);
    };
    // Implementation of the on method
    RealTimeChannel.prototype.on = function (arg1, arg2) {
        var _this = this;
        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
            this.events.on(arg1, arg2);
        }
        else if (Array.isArray(arg1) && typeof arg2 === "function") {
            // Overload 2
            arg1.forEach(function (eventName) {
                _this.events.on(eventName, arg2);
            });
        }
        else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 3
            DefaultChannelEvents_1.DefaultChannelEvents.forEach(function (eventName) {
                _this.events.on(eventName, arg1);
            });
        }
        else {
            throw new Error("Invalid arguments");
        }
    };
    RealTimeChannel.prototype.once = function (arg1, arg2) {
        var _this = this;
        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
            this.events.once(arg1, arg2);
        }
        else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 2
            DefaultChannelEvents_1.DefaultChannelEvents.forEach(function (eventName) {
                _this.events.once(eventName, arg1);
            });
        }
        else {
            throw new Error("Invalid arguments");
        }
    };
    RealTimeChannel.prototype.off = function (arg1, arg2) {
        var _this = this;
        if (typeof arg1 === "string" && typeof arg2 === "function") {
            // Overload 1
            this.events.off(arg1, arg2);
        }
        else if (Array.isArray(arg1) && typeof arg2 === "function") {
            // Overload 2
            arg1.forEach(function (eventName) {
                _this.events.off(eventName, arg2);
            });
        }
        else if (typeof arg1 === "string" && arg2 === undefined) {
            // Overload 3
            this.events.off(arg1);
        }
        else if (Array.isArray(arg1) && arg2 === undefined) {
            // Overload 4
            this.events.removeAllListeners(arg1);
        }
        else if (typeof arg1 === "function" && arg2 === undefined) {
            // Overload 5
            this.events.off(arg1);
        }
        else if (arg1 === undefined && arg2 === undefined) {
            // Overload 6
            this.events.removeAllListeners();
        }
        else {
            throw new Error("Invalid arguments");
        }
    };
    RealTimeChannel.prototype.destroy = function () {
        if (this.channel) {
            this.unsubscribe();
            this.channel.killAllListeners();
            this.channel.kill();
        }
        this.off();
    };
    return RealTimeChannel;
}());
exports.RealTimeChannel = RealTimeChannel;

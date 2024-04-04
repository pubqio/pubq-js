"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
var jwt_1 = require("./utils/jwt");
var time_1 = require("./utils/time");
var Http_1 = require("./Http");
var WebSocket_1 = require("./WebSocket");
var OptionsManager_1 = require("./OptionsManager");
var Auth = /** @class */ (function () {
    function Auth() {
        this.ws = WebSocket_1.WebSocket.getInstance();
        this.options = OptionsManager_1.OptionsManager.getInstance().get();
        this.http = new Http_1.Http();
        this.client = this.http.getClient();
    }
    Auth.getInstance = function () {
        if (!this.instance) {
            this.instance = new Auth();
        }
        return this.instance;
    };
    Auth.prototype.getAuthMethod = function () {
        if (typeof this.options.authUrl !== "undefined" &&
            this.options.authUrl) {
            return "Bearer";
        }
        else if (typeof this.options.key !== "undefined" &&
            this.options.key) {
            return "Basic";
        }
        return false;
    };
    Auth.prototype.getKeyOrToken = function () {
        if (!this.options.authTokenName) {
            throw new Error("Auth token name can not be empty.");
        }
        if (this.options.authUrl) {
            return (0, jwt_1.getSignedAuthToken)(this.options.authTokenName);
        }
        else if (this.options.key) {
            return this.getKeyBase64();
        }
        return false;
    };
    Auth.prototype.getKey = function () {
        if (this.options.key) {
            return this.options.key;
        }
        throw new Error("API key has not been specified.");
    };
    Auth.prototype.getKeyBase64 = function () {
        return Buffer.from(this.getKey()).toString("base64");
    };
    Auth.prototype.makeAuthorizationHeader = function () {
        if (this.getAuthMethod() && this.getKeyOrToken()) {
            return "".concat(this.getAuthMethod(), " ").concat(this.getKeyOrToken());
        }
        throw new Error("Auth method has not been specified.");
    };
    Auth.prototype.basicAuth = function () {
        var socket = this.ws.getSocket();
        var credentials = {};
        credentials.key = this.getKey();
        socket.invoke("#basicAuth", credentials);
    };
    Auth.prototype.authenticate = function (body, headers) {
        if (body === void 0) { body = {}; }
        if (headers === void 0) { headers = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var socket, authMethod, tokenData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.ws) {
                            this.ws = WebSocket_1.WebSocket.getInstance();
                        }
                        socket = this.ws.getSocket();
                        authMethod = this.getAuthMethod();
                        if (!(authMethod === "Basic")) return [3 /*break*/, 1];
                        this.basicAuth();
                        return [3 /*break*/, 3];
                    case 1:
                        if (!(authMethod === "Bearer")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.requestToken()];
                    case 2:
                        tokenData = _a.sent();
                        socket.authenticate(tokenData.token);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Auth.prototype.deauthenticate = function () {
        var socket = this.ws.getSocket();
        this.requestRevoke();
        socket.deauthenticate();
    };
    Auth.prototype.requestToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.options.authUrl && this.options.authTokenName)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.post(this.options.authUrl, this.options.authBody, { headers: this.options.authHeaders })];
                    case 2:
                        response = _a.sent();
                        localStorage.setItem(this.options.authTokenName, response.data.data.token);
                        return [2 /*return*/, response.data.data];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error in requestToken:", error_1);
                        throw error_1;
                    case 4: throw new Error("Auth URL has not been provided.");
                }
            });
        });
    };
    Auth.prototype.requestRefresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            var body, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.options.refreshUrl && this.options.authTokenName)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        body = __assign(__assign({}, this.options.authBody), {
                            token: (0, jwt_1.getSignedAuthToken)(this.options.authTokenName),
                        });
                        return [4 /*yield*/, this.client.post(this.options.refreshUrl, body, {
                                headers: this.options.authHeaders,
                            })];
                    case 2:
                        response = _a.sent();
                        localStorage.setItem(this.options.authTokenName, response.data.data.token);
                        return [2 /*return*/, response.data.data];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Error in requestRefresh:", error_2);
                        throw error_2;
                    case 4: throw new Error("Refresh URL has not been provided.");
                }
            });
        });
    };
    Auth.prototype.requestRevoke = function () {
        return __awaiter(this, void 0, void 0, function () {
            var body, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.options.revokeUrl && this.options.authTokenName)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        body = __assign(__assign({}, this.options.authBody), {
                            token: (0, jwt_1.getSignedAuthToken)(this.options.authTokenName),
                        });
                        return [4 /*yield*/, this.client.post(this.options.revokeUrl, body, {
                                headers: this.options.authHeaders,
                            })];
                    case 2:
                        response = _a.sent();
                        localStorage.removeItem(this.options.authTokenName);
                        return [2 /*return*/, response.data.data];
                    case 3:
                        error_3 = _a.sent();
                        console.error("Error in requestRevoke:", error_3);
                        throw error_3;
                    case 4: throw new Error("Revoke URL has not been provided.");
                }
            });
        });
    };
    Auth.prototype.startRefreshTokenInterval = function () {
        var _this = this;
        if (this.getAuthMethod() === "Bearer") {
            // Stop if any refresh token interval is exist
            this.stopRefreshTokenInterval();
            this.refreshTokenIntervalId = setInterval(function () {
                if (_this.options.authTokenName) {
                    var token = (0, jwt_1.getSignedAuthToken)(_this.options.authTokenName);
                    var authToken = (0, jwt_1.getJwtPayload)(token);
                    if (authToken) {
                        var remainingSeconds = (0, time_1.getRemainingSeconds)(authToken.exp);
                        if (remainingSeconds <= 60) {
                            _this.requestRefresh();
                        }
                    }
                }
            }, this.options.refreshTokenInterval);
        }
    };
    Auth.prototype.stopRefreshTokenInterval = function () {
        if (this.refreshTokenIntervalId) {
            clearInterval(this.refreshTokenIntervalId);
        }
    };
    Auth.prototype.destroy = function () {
        this.stopRefreshTokenInterval();
        if (this.options.authTokenName) {
            localStorage.removeItem(this.options.authTokenName);
        }
        Auth.instance = undefined;
    };
    return Auth;
}());
exports.Auth = Auth;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Http = void 0;
var axios_1 = __importDefault(require("axios"));
var Http = /** @class */ (function () {
    function Http() {
        this.baseUrl = "https://rest.pubq.dev";
        this.client = axios_1.default.create({
            baseURL: this.baseUrl,
        });
    }
    Http.prototype.getClient = function () {
        return this.client;
    };
    return Http;
}());
exports.Http = Http;

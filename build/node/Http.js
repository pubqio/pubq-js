"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Http = void 0;
const axios_1 = __importDefault(require("axios"));
class Http {
    baseUrl = "https://rest.pubq.io";
    client;
    constructor() {
        this.client = axios_1.default.create({
            baseURL: this.baseUrl,
        });
    }
    getClient() {
        return this.client;
    }
}
exports.Http = Http;

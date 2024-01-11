import { CommonOptions } from "./types/CommonOptions";
declare class WebSocket {
    private static instance;
    socket: any;
    private constructor();
    static getInstance(sccOptions?: CommonOptions): WebSocket;
    getSocket(): WebSocket | null;
}
export { WebSocket };

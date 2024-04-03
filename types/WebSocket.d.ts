declare class WebSocket {
    private static instance;
    socket: any;
    private constructor();
    static getInstance(): WebSocket;
    getSocket(): WebSocket | null;
    destroy(): void;
}
export { WebSocket };

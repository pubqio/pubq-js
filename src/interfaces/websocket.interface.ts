export interface PubQWebSocket {
    onopen: ((event: any) => void) | null;
    onclose: ((event: any) => void) | null;
    onmessage: ((event: any) => void) | null;
    onerror: ((event: any) => void) | null;
    close(): void;
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
}

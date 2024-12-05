export interface PubQWebSocket {
    onopen: ((event: any) => void) | null;
    onclose: ((event: any) => void) | null;
    onmessage: ((event: any) => void) | null;
    onerror: ((event: any) => void) | null;
    onping: ((event: any) => void) | null;
    onpong: ((event: any) => void) | null;
    close(): void;
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
    readyState: number;
}

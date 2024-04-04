export type ErrorInfo = {
    code: number | null;
    statusCode?: number;
    message?: string;
    cause?: Error;
    href?: string;
};

declare class REST {
    private applicationKey;
    private httpClient;
    constructor(applicationKey: string);
    publish(channel: string, data: string | any[]): Promise<any>;
}
export { REST };

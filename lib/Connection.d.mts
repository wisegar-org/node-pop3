export default Pop3Connection;
declare class Pop3Connection {
    constructor({ host, port, tls, timeout, tlsOptions, servername }: {
        host: any;
        port: any;
        tls: any;
        timeout: any;
        tlsOptions: any;
        servername: any;
    });
    host: any;
    port: any;
    tls: any;
    timeout: any;
    _socket: any;
    _stream: any;
    tlsOptions: any;
    servername: any;
    _updateStream(): any;
    _pushStream(buffer: any): void;
    _endStream(err: any): void;
    connect(): Promise<any>;
    command(...args: any[]): Promise<any>;
    _command: string | undefined;
}
//# sourceMappingURL=Connection.d.mts.map
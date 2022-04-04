export default Pop3Command;
declare class Pop3Command extends Pop3Connection {
    constructor({ user, password, host, port, tls, timeout, tlsOptions, servername }: {
        user: any;
        password: any;
        host: any;
        port: any;
        tls: any;
        timeout: any;
        tlsOptions: any;
        servername: any;
    });
    user: any;
    password: any;
    _PASSInfo: string;
    _connect(): Promise<string>;
    UIDL(msgNumber?: string): Promise<any>;
    NOOP(): Promise<void>;
    LIST(msgNumber?: string): Promise<any>;
    RSET(): Promise<any>;
    RETR(msgNumber: any): Promise<any>;
    DELE(msgNumber: any): Promise<any>;
    STAT(): Promise<any>;
    TOP(msgNumber: any, n?: number): Promise<any>;
    QUIT(): Promise<string>;
}
declare namespace Pop3Command {
    export { stream2String };
    export { listify };
}
import Pop3Connection from "./Connection.mjs";
import { stream2String } from "./helper.mjs";
import { listify } from "./helper.mjs";
//# sourceMappingURL=Command.d.mts.map
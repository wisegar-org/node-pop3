import Pop3Connection, { IPop3ConnectionOptions } from "./Connection.js";
declare class Pop3Command extends Pop3Connection {
    user: string;
    password: string;
    _PASSInfo: string;
    static stream2String: (stream: any) => Promise<unknown>;
    static listify: (str: string) => string[][];
    constructor(options: IPop3ConnectionOptions);
    _connect(): Promise<string>;
    UIDL(msgNumber?: string): Promise<string[] | string[][]>;
    NOOP(): Promise<void>;
    LIST(msgNumber?: string): Promise<string[] | string[][]>;
    RSET(): Promise<any>;
    RETR(msgNumber: string | number): Promise<string>;
    DELE(msgNumber: string | number): Promise<any>;
    STAT(): Promise<any>;
    TOP(msgNumber: string | number, n?: number): Promise<string>;
    QUIT(): Promise<string>;
}
export default Pop3Command;
//# sourceMappingURL=Command.d.ts.map
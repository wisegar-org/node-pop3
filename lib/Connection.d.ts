/// <reference types="node" />
import { EventEmitter } from "events";
export interface IPop3ConnectionOptions {
    user: string;
    password: string;
    host: string;
    /**
     * @default 110
     */
    port?: number;
    servername?: string;
    /**
     * @default false
     */
    tls?: boolean;
    /**
     * @default undefined
     */
    timeout?: any;
    /**
     * @default {}
     */
    tlsOptions?: any;
}
declare class Pop3Connection extends EventEmitter {
    host: string;
    port: number;
    tls: any;
    timeout: any;
    _socket: any;
    _stream: any;
    _command: any;
    tlsOptions: any;
    servername: any;
    constructor(options: IPop3ConnectionOptions);
    _updateStream(): any;
    _pushStream(buffer: any): void;
    _endStream(err?: Error): void;
    connect(): Promise<void>;
    command(...args: any): Promise<any>;
}
export default Pop3Connection;
//# sourceMappingURL=Connection.d.ts.map
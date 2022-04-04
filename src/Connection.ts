import { Socket } from "net";
import _tls from "tls";
import { EventEmitter } from "events";
import { Readable } from "stream";

import {
  CRLF,
  CRLF_BUFFER,
  TERMINATOR_BUFFER,
  TERMINATOR_BUFFER_ARRAY,
  MULTI_LINE_COMMAND_NAME,
} from "./constant.js";

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

class Pop3Connection extends EventEmitter {
  host: string;
  port: number;
  tls: any;
  timeout: any;
  _socket: any;
  _stream: any;
  _command: any;
  tlsOptions: any;
  servername: any;
  constructor(options: IPop3ConnectionOptions) {
    super();
    this.host = options.host;
    this.port = options.port || (options.tls ? 995 : 110);
    this.tls = options.tls;
    this.timeout = options.timeout;
    this._socket = null;
    this._stream = null;
    this._command;
    this.tlsOptions = options.tlsOptions || {};
    this.servername = options.servername || options.host;
  }

  _updateStream() {
    this._stream = new Readable({
      read: () => {},
    });
    return this._stream;
  }

  _pushStream(buffer: any) {
    if (TERMINATOR_BUFFER_ARRAY.some((_buffer) => _buffer.equals(buffer))) {
      return this._endStream();
    }
    const endBuffer = buffer.slice(-5);
    if (endBuffer.equals(TERMINATOR_BUFFER)) {
      this._stream.push(buffer.slice(0, -5));
      return this._endStream();
    }
    this._stream.push(buffer);
  }

  _endStream(err?: Error) {
    if (this._stream) {
      this._stream.push(null);
    }
    this._stream = null;
    this.emit("end", err);
  }

  connect() {
    const { host, port, tlsOptions, servername } = this;
    const socket = new Socket();
    socket.setKeepAlive(true);
    return new Promise<void>((resolve, reject) => {
      if (typeof this.timeout !== "undefined") {
        socket.setTimeout(this.timeout, () => {
          const err = new Error("timeout");
          (err as any).eventName = "timeout";
          reject(err);
          if (this.listeners("end").length) {
            this.emit("end", err);
          }
          if (this.listeners("error").length) {
            this.emit("error", err);
          }
          this._socket.end();
          this._socket = null;
        });
      }
      if (this.tls) {
        const options = Object.assign(
          { host, port, socket, servername },
          tlsOptions
        );
        this._socket = _tls.connect(options);
      } else {
        this._socket = socket;
      }

      this._socket.on("data", (buffer: any) => {
        if (this._stream) {
          return this._pushStream(buffer);
        }
        if (buffer[0] === 45) {
          // '-'
          const err = new Error(buffer.slice(5, -2));
          (err as any).eventName = "error";
          (err as any).command = this._command;
          return this.emit("error", err);
        }
        if (buffer[0] === 43) {
          // '+'
          const firstLineEndIndex = buffer.indexOf(CRLF_BUFFER);
          const infoBuffer = buffer.slice(4, firstLineEndIndex);
          const [commandName] = (this._command || "").split(" ");
          let stream = null;
          if (MULTI_LINE_COMMAND_NAME.includes(commandName)) {
            this._updateStream();
            stream = this._stream;
            const bodyBuffer = buffer.slice(firstLineEndIndex + 2);
            if (bodyBuffer[0]) {
              this._pushStream(bodyBuffer);
            }
          }
          this.emit("response", infoBuffer.toString(), stream);
          resolve();
          return;
        }
        const err = new Error("Unexpected response");
        (err as any).eventName = "bad-server-response";
        reject(err);
      });
      this._socket.on("error", (err: any) => {
        err.eventName = "error";
        if (this._stream) {
          this.emit("error", err);
          return;
        }
        reject(err);
        this._socket = null;
      });
      this._socket.once("close", () => {
        const err = new Error("close");
        (err as any).eventName = "close";
        reject(err);
        this._socket = null;
      });
      this._socket.once("end", () => {
        const err = new Error("end");
        (err as any).eventName = "end";
        reject(err);
        this._socket = null;
      });
      socket.connect({
        host,
        port,
      });
    });
  }

  async command(...args: any): Promise<any> {
    this._command = args.join(" ");
    if (!this._socket) {
      throw new Error("no-socket");
    }
    await new Promise<void>((resolve, reject) => {
      if (!this._stream) {
        return resolve();
      }
      this.once("error", (err) => {
        return reject(err);
      });
      this.once("end", (err) => {
        return err ? reject(err) : resolve();
      });
    });
    return new Promise((resolve, reject) => {
      const rejectFn = (err: any) => reject(err);
      this.once("error", rejectFn);
      this.once("response", (info, stream) => {
        this.removeListener("error", rejectFn);
        resolve([info, stream]);
      });
      if (!this._socket) {
        reject(new Error("no-socket"));
      }
      this._socket.write(`${this._command}${CRLF}`, "utf8");
    });
  }
}

export default Pop3Connection;

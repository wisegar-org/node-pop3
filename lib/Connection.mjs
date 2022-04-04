"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const tls_1 = __importDefault(require("tls"));
const events_1 = require("events");
const stream_1 = require("stream");
const constant_mjs_1 = require("./constant.mjs");
class Pop3Connection extends events_1.EventEmitter {
    constructor({ host, port, tls, timeout, tlsOptions, servername }) {
        super();
        this.host = host;
        this.port = port || (tls ? 995 : 110);
        this.tls = tls;
        this.timeout = timeout;
        this._socket = null;
        this._stream = null;
        this._command;
        this.tlsOptions = tlsOptions || {};
        this.servername = servername || host;
    }
    _updateStream() {
        this._stream = new stream_1.Readable({
            read: () => { },
        });
        return this._stream;
    }
    _pushStream(buffer) {
        if (constant_mjs_1.TERMINATOR_BUFFER_ARRAY.some((_buffer) => _buffer.equals(buffer))) {
            return this._endStream();
        }
        const endBuffer = buffer.slice(-5);
        if (endBuffer.equals(constant_mjs_1.TERMINATOR_BUFFER)) {
            this._stream.push(buffer.slice(0, -5));
            return this._endStream();
        }
        this._stream.push(buffer);
    }
    _endStream(err) {
        if (this._stream) {
            this._stream.push(null);
        }
        this._stream = null;
        this.emit('end', err);
    }
    connect() {
        const { host, port, tlsOptions, servername } = this;
        const socket = new net_1.Socket();
        socket.setKeepAlive(true);
        return new Promise((resolve, reject) => {
            if (typeof this.timeout !== 'undefined') {
                socket.setTimeout(this.timeout, () => {
                    const err = new Error('timeout');
                    err.eventName = 'timeout';
                    reject(err);
                    if (this.listeners('end').length) {
                        this.emit('end', err);
                    }
                    if (this.listeners('error').length) {
                        this.emit('error', err);
                    }
                    this._socket.end();
                    this._socket = null;
                });
            }
            if (this.tls) {
                const options = Object.assign({ host, port, socket, servername }, tlsOptions);
                this._socket = tls_1.default.connect(options);
            }
            else {
                this._socket = socket;
            }
            this._socket.on('data', (buffer) => {
                if (this._stream) {
                    return this._pushStream(buffer);
                }
                if (buffer[0] === 45) { // '-'
                    const err = new Error(buffer.slice(5, -2));
                    err.eventName = 'error';
                    err.command = this._command;
                    return this.emit('error', err);
                }
                if (buffer[0] === 43) { // '+'
                    const firstLineEndIndex = buffer.indexOf(constant_mjs_1.CRLF_BUFFER);
                    const infoBuffer = buffer.slice(4, firstLineEndIndex);
                    const [commandName] = (this._command || '').split(' ');
                    let stream = null;
                    if (constant_mjs_1.MULTI_LINE_COMMAND_NAME.includes(commandName)) {
                        this._updateStream();
                        stream = this._stream;
                        const bodyBuffer = buffer.slice(firstLineEndIndex + 2);
                        if (bodyBuffer[0]) {
                            this._pushStream(bodyBuffer);
                        }
                    }
                    this.emit('response', infoBuffer.toString(), stream);
                    resolve();
                    return;
                }
                const err = new Error('Unexpected response');
                err.eventName = 'bad-server-response';
                reject(err);
            });
            this._socket.on('error', (err) => {
                err.eventName = 'error';
                if (this._stream) {
                    this.emit('error', err);
                    return;
                }
                reject(err);
                this._socket = null;
            });
            this._socket.once('close', () => {
                const err = new Error('close');
                err.eventName = 'close';
                reject(err);
                this._socket = null;
            });
            this._socket.once('end', () => {
                const err = new Error('end');
                err.eventName = 'end';
                reject(err);
                this._socket = null;
            });
            socket.connect({
                host,
                port,
            });
        });
    }
    command(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            this._command = args.join(' ');
            if (!this._socket) {
                throw new Error('no-socket');
            }
            yield new Promise((resolve, reject) => {
                if (!this._stream) {
                    return resolve();
                }
                this.once('error', (err) => {
                    return reject(err);
                });
                this.once('end', (err) => {
                    return err ? reject(err) : resolve();
                });
            });
            return new Promise((resolve, reject) => {
                const rejectFn = (err) => reject(err);
                this.once('error', rejectFn);
                this.once('response', (info, stream) => {
                    this.removeListener('error', rejectFn);
                    resolve([info, stream]);
                });
                if (!this._socket) {
                    reject(new Error('no-socket'));
                }
                this._socket.write(`${this._command}${constant_mjs_1.CRLF}`, 'utf8');
            });
        });
    }
}
exports.default = Pop3Connection;
//# sourceMappingURL=Connection.mjs.map
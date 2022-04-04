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
const Connection_mjs_1 = __importDefault(require("./Connection.mjs"));
const helper_mjs_1 = require("./helper.mjs");
class Pop3Command extends Connection_mjs_1.default {
    constructor({ user, password, host, port, tls, timeout, tlsOptions, servername }) {
        super({ host, port, tls, timeout, tlsOptions, servername });
        this.user = user;
        this.password = password;
        this._PASSInfo = '';
    }
    _connect() {
        const _super = Object.create(null, {
            connect: { get: () => super.connect },
            command: { get: () => super.command }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this._socket) {
                return this._PASSInfo;
            }
            yield _super.connect.call(this);
            yield _super.command.call(this, 'USER', this.user);
            const [info] = yield _super.command.call(this, 'PASS', this.password);
            this._PASSInfo = info;
            return this._PASSInfo;
        });
    }
    UIDL(msgNumber = '') {
        const _super = Object.create(null, {
            command: { get: () => super.command }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this._connect();
            const [, stream] = yield _super.command.call(this, 'UIDL', msgNumber);
            const str = yield (0, helper_mjs_1.stream2String)(stream);
            const list = (0, helper_mjs_1.listify)(str);
            return msgNumber ? list[0] : list;
        });
    }
    NOOP() {
        const _super = Object.create(null, {
            command: { get: () => super.command }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this._connect();
            yield _super.command.call(this, 'NOOP');
            return;
        });
    }
    LIST(msgNumber = '') {
        const _super = Object.create(null, {
            command: { get: () => super.command }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this._connect();
            const [, stream] = yield _super.command.call(this, 'LIST', msgNumber);
            const str = yield (0, helper_mjs_1.stream2String)(stream);
            const list = (0, helper_mjs_1.listify)(str);
            return msgNumber ? list[0] : list;
        });
    }
    RSET() {
        const _super = Object.create(null, {
            command: { get: () => super.command }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this._connect();
            const [info] = yield _super.command.call(this, 'RSET');
            return info;
        });
    }
    RETR(msgNumber) {
        const _super = Object.create(null, {
            command: { get: () => super.command }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this._connect();
            const [, stream] = yield _super.command.call(this, 'RETR', msgNumber);
            return (0, helper_mjs_1.stream2String)(stream);
        });
    }
    DELE(msgNumber) {
        const _super = Object.create(null, {
            command: { get: () => super.command }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this._connect();
            const [info] = yield _super.command.call(this, 'DELE', msgNumber);
            return info;
        });
    }
    STAT() {
        const _super = Object.create(null, {
            command: { get: () => super.command }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this._connect();
            const [info] = yield _super.command.call(this, 'STAT');
            return info;
        });
    }
    TOP(msgNumber, n = 0) {
        const _super = Object.create(null, {
            command: { get: () => super.command }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this._connect();
            const [, stream] = yield _super.command.call(this, 'TOP', msgNumber, n);
            return (0, helper_mjs_1.stream2String)(stream);
        });
    }
    QUIT() {
        const _super = Object.create(null, {
            command: { get: () => super.command }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._socket) {
                this._PASSInfo = '' || 'Bye';
                return this._PASSInfo;
            }
            const [info] = yield _super.command.call(this, 'QUIT');
            this._PASSInfo = info || '';
            return this._PASSInfo;
        });
    }
}
Pop3Command.stream2String = helper_mjs_1.stream2String;
Pop3Command.listify = helper_mjs_1.listify;
exports.default = Pop3Command;
//# sourceMappingURL=Command.mjs.map
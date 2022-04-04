"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listify = exports.stream2String = void 0;
const constant_mjs_1 = require("./constant.mjs");
function stream2String(stream) {
    return new Promise((resolve, reject) => {
        let buffer = Buffer.concat([]);
        let { length } = buffer;
        stream.on('data', (_buffer) => {
            length += _buffer.length;
            buffer = Buffer.concat([buffer, _buffer], length);
        });
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(buffer.toString()));
    });
}
exports.stream2String = stream2String;
function listify(str) {
    return str.split(constant_mjs_1.CRLF)
        .filter((line) => line)
        .map((line) => line.split(' '));
}
exports.listify = listify;
//# sourceMappingURL=helper.mjs.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MULTI_LINE_COMMAND_NAME = exports.TERMINATOR_BUFFER_ARRAY = exports.TERMINATOR_BUFFER = exports.CRLF_BUFFER = exports.CRLF = void 0;
exports.CRLF = '\r\n';
exports.CRLF_BUFFER = Buffer.from('\r\n');
exports.TERMINATOR_BUFFER = Buffer.from('\r\n.\r\n');
exports.TERMINATOR_BUFFER_ARRAY = [
    Buffer.from('\r\n.\r\n'),
    Buffer.from('.\r\n'),
];
exports.MULTI_LINE_COMMAND_NAME = [
    'LIST',
    'RETR',
    'TOP',
    'UIDL',
];
//# sourceMappingURL=constant.mjs.map
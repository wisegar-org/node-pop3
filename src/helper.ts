import { CRLF } from "./constant.js";

export function stream2String(stream: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.concat([]);
    let { length } = buffer;
    stream.on("data", (_buffer: Buffer) => {
      length += _buffer.length;
      buffer = Buffer.concat([buffer, _buffer], length);
    });
    stream.on("error", (err: Error) => reject(err));
    stream.on("end", () => resolve(buffer.toString()));
  });
}

export function listify(str: string) {
  return str
    .split(CRLF)
    .filter((line) => line)
    .map((line) => line.split(" "));
}

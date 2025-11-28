export function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Uint8Array<ArrayBufferLike>[] = [];

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

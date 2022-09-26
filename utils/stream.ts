import internal from 'stream';

export const streamToString: (stream: internal.Readable) => Promise<string> = (
  stream: internal.Readable,
) =>
  new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });

export const streamToBuffer: (stream: internal.Readable) => Promise<Buffer> = (
  stream: internal.Readable,
) =>
  new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks) as Buffer));
  });

import crypto = require('crypto');

export function fileHashMd5(buffer: Buffer) {
  const hash = crypto.createHash('md5');
  hash.update(buffer);
  const md5 = hash.digest('hex');
  return md5;
}

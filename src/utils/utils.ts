import crypto = require('crypto');

export function Md5(buffer: string) {
  const hash = crypto.createHash('md5');
  hash.update(buffer);
  const md5 = hash.digest('hex');
  return md5;
}

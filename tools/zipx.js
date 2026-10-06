const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const zipfile = process.argv[2];
const outdir = process.argv[3];
const buf = fs.readFileSync(zipfile);
let eocd = -1;
for (let i = buf.length - 22; i >= 0 && i > buf.length - 65558; i--) { if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; } }
if (eocd < 0) { console.log('NO EOCD'); process.exit(1); }
const total = buf.readUInt16LE(eocd + 10);
const cdOff = buf.readUInt32LE(eocd + 16);
let p = cdOff;
fs.mkdirSync(outdir, {recursive: true});
let n = 0;
for (let i = 0; i < total; i++) {
  if (buf.readUInt32LE(p) !== 0x02014b50) break;
  const method = buf.readUInt16LE(p + 10);
  const compSize = buf.readUInt32LE(p + 20);
  const uncompSize = buf.readUInt32LE(p + 24);
  const nameLen = buf.readUInt16LE(p + 28);
  const extraLen = buf.readUInt16LE(p + 30);
  const commentLen = buf.readUInt16LE(p + 32);
  const localOff = buf.readUInt32LE(p + 42);
  const name = buf.slice(p + 46, p + 46 + nameLen).toString('utf8');
  p += 46 + nameLen + extraLen + commentLen;
  const lp = localOff;
  const lNameLen = buf.readUInt16LE(lp + 26);
  const lExtraLen = buf.readUInt16LE(lp + 28);
  const dataStart = lp + 30 + lNameLen + lExtraLen;
  const raw = buf.slice(dataStart, dataStart + compSize);
  const outPath = path.join(outdir, name);
  if (name.endsWith('/')) { fs.mkdirSync(outPath, {recursive: true}); continue; }
  fs.mkdirSync(path.dirname(outPath), {recursive: true});
  let data;
  if (method === 0) data = raw;
  else if (method === 8) data = zlib.inflateRawSync(raw);
  else { console.log('skip method ' + method + ' ' + name); continue; }
  fs.writeFileSync(outPath, data);
  n++;
}
console.log('extracted ' + n + ' files -> ' + outdir);

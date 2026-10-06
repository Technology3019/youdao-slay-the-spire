const fs = require('fs');
const buf = fs.readFileSync(process.argv[2]);
let eocd = -1;
for (let i = buf.length - 22; i >= 0 && i > buf.length - 65558; i--) { if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; } }
if (eocd < 0) { console.log('NO EOCD'); process.exit(1); }
const total = buf.readUInt16LE(eocd + 10);
const cdOff = buf.readUInt32LE(eocd + 16);
console.log('entries=' + total);
let p = cdOff;
const entries = [];
for (let i = 0; i < total; i++) {
  if (buf.readUInt32LE(p) !== 0x02014b50) { console.log('bad CD at ' + p); break; }
  const method = buf.readUInt16LE(p + 10);
  const compSize = buf.readUInt32LE(p + 20);
  const uncompSize = buf.readUInt32LE(p + 24);
  const nameLen = buf.readUInt16LE(p + 28);
  const extraLen = buf.readUInt16LE(p + 30);
  const commentLen = buf.readUInt16LE(p + 32);
  const localOff = buf.readUInt32LE(p + 42);
  const name = buf.slice(p + 46, p + 46 + nameLen).toString('utf8');
  entries.push({name: name, compSize: compSize, uncompSize: uncompSize, method: method, localOff: localOff});
  p += 46 + nameLen + extraLen + commentLen;
}
fs.writeFileSync(process.argv[3], JSON.stringify(entries));
console.log('--- first 50 ---');
entries.slice(0, 50).forEach(function(e){ console.log(e.uncompSize + '\t' + e.name); });
const ext = {};
entries.forEach(function(e){ const m = e.name.match(/\.([^.\/]+)$/); const k = m ? m[1] : '(dir)'; ext[k] = (ext[k]||0)+1; });
console.log('--- ext summary ---');
console.log(JSON.stringify(ext));

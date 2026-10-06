const fs = require('fs');
const f = '/root/杀戮尖塔/tools/art/artlib.js';
let s = fs.readFileSync(f, 'utf8');
if (s.includes('rgba(')) { console.log('already patched'); process.exit(0); }
const needle = "  if (typeof c !== 'string') throw new Error('bad color');";
if (!s.includes(needle)) { console.log('needle missing'); process.exit(1); }
const add = needle + `
  const m = /^rgba?\(([^)]+)\)$/.exec(c.trim());
  if (m) {
    const p = m[1].split(',').map(v => parseFloat(v.trim()));
    return [p[0] | 0, p[1] | 0, p[2] | 0, p.length > 3 ? Math.round(p[3] * 255) : 255];
  }`;
s = s.replace(needle, add);
fs.writeFileSync(f, s);
console.log('patched ok');

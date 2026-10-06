const fs = require('fs');
const f = '/root/杀戮尖塔/tools/art/artlib.js';
let s = fs.readFileSync(f, 'utf8');
const start = s.indexOf('function hex(c) {');
const end = s.indexOf('\n}', start);
if (start < 0 || end < 0) { console.log('anchor missing'); process.exit(1); }
const neu = `function hex(c) {
  if (Array.isArray(c)) return c;
  if (typeof c !== 'string') throw new Error('bad color type: ' + typeof c);
  const t = c.trim();
  if (t.charAt(0) === '#') {
    let s2 = t.slice(1);
    if (s2.length === 3 || s2.length === 4) s2 = s2.split('').map(ch => ch + ch).join('');
    if (s2.length === 6) s2 += 'ff';
    if (s2.length !== 8) throw new Error('bad hex color: ' + c);
    return [parseInt(s2.slice(0,2),16), parseInt(s2.slice(2,4),16), parseInt(s2.slice(4,6),16), parseInt(s2.slice(6,8),16)];
  }
  const m = /^(?:rgb|rgba)\\(([^)]*)\\)$/.exec(t);
  if (m) {
    const p = m[1].split(',').map(v => parseFloat(v.trim()));
    if (p.length < 3 || isNaN(p[0]) || isNaN(p[1]) || isNaN(p[2])) throw new Error('bad rgb color: ' + c);
    return [p[0]|0, p[1]|0, p[2]|0, (p.length > 3 && !isNaN(p[3])) ? Math.round(p[3] * 255) : 255];
  }
  throw new Error('bad color: ' + c);
}`;
s = s.slice(0, start) + neu + s.slice(end + 2);
fs.writeFileSync(f, s);
console.log('hex rewritten');

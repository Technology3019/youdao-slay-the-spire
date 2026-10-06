const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function hex(c) {
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
  const m = /^(?:rgb|rgba)\(([^)]*)\)$/.exec(t);
  if (m) {
    const p = m[1].split(',').map(v => parseFloat(v.trim()));
    if (p.length < 3 || isNaN(p[0]) || isNaN(p[1]) || isNaN(p[2])) throw new Error('bad rgb color: ' + c);
    return [p[0]|0, p[1]|0, p[2]|0, (p.length > 3 && !isNaN(p[3])) ? Math.round(p[3] * 255) : 255];
  }
  throw new Error('bad color: ' + c);
}

const CRC_TABLE = (function(){
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

class Img {
  constructor(w, h, bg) {
    this.w = w; this.h = h;
    this.d = Buffer.alloc(w * h * 4, 0);
    if (bg) this.fill(bg);
  }
  blend(x, y, r, g, b, a) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h || a <= 0) return;
    const i = (y * this.w + x) * 4;
    const d = this.d, da = d[i+3] / 255, sa = a;
    const oa = sa + da * (1 - sa);
    if (oa <= 0) return;
    d[i]   = Math.round((r * sa + d[i]   * da * (1 - sa)) / oa);
    d[i+1] = Math.round((g * sa + d[i+1] * da * (1 - sa)) / oa);
    d[i+2] = Math.round((b * sa + d[i+2] * da * (1 - sa)) / oa);
    d[i+3] = Math.round(oa * 255);
  }
  cov(x, y, cov, col) {
    if (cov <= 0) return;
    this.blend(x, y, col[0], col[1], col[2], col[3] / 255 * Math.min(1, cov));
  }
  fill(c) {
    const [r,g,b,a] = hex(c);
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) this.blend(x,y,r,g,b,a/255);
  }
  rect(x, y, w, h, c) {
    const [r,g,b,a] = hex(c);
    for (let yy = Math.floor(y); yy < y + h; yy++)
      for (let xx = Math.floor(x); xx < x + w; xx++) this.blend(xx, yy, r, g, b, a/255);
  }
  // coverage-based circle
  circle(cx, cy, r, c) {
    const [cr,cg,cb,ca] = hex(c);
    for (let y = Math.floor(cy - r - 1); y <= cy + r + 1; y++)
      for (let x = Math.floor(cx - r - 1); x <= cx + r + 1; x++) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        const cov = Math.max(0, Math.min(1, r - d + 0.5));
        this.cov(x, y, cov, [cr,cg,cb,ca]);
      }
  }
  ellipse(cx, cy, rx, ry, c) {
    const [cr,cg,cb,ca] = hex(c);
    for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++)
      for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
        const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry;
        const d = Math.sqrt(nx*nx + ny*ny);
        const cov = Math.max(0, Math.min(1, (1 - d) * Math.min(rx, ry) + 0.5));
        this.cov(x, y, cov, [cr,cg,cb,ca]);
      }
  }
  ring(cx, cy, r, th, c) {
    const [cr,cg,cb,ca] = hex(c);
    const r0 = r - th / 2, r1 = r + th / 2;
    for (let y = Math.floor(r1 + 1) >= 0 ? Math.floor(cy - r1 - 1) : 0; y <= cy + r1 + 1; y++)
      for (let x = Math.floor(cx - r1 - 1); x <= cx + r1 + 1; x++) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        let cov = 0;
        if (d >= r0 && d <= r1) cov = 1;
        else if (d < r0) cov = Math.max(0, Math.min(1, d - r0 + 0.5));
        else cov = Math.max(0, Math.min(1, r1 - d + 0.5));
        this.cov(x, y, cov, [cr,cg,cb,ca]);
      }
  }
  rrect(x, y, w, h, rad, c) {
    const [cr,cg,cb,ca] = hex(c);
    const x0 = x, y0 = y, x1 = x + w, y1 = y + h;
    for (let yy = Math.floor(y0); yy < y1; yy++)
      for (let xx = Math.floor(x0); xx < x1; xx++) {
        const px = xx + 0.5, py = yy + 0.5;
        const qx = Math.max(x0 + rad - px, 0, px - (x1 - rad));
        const qy = Math.max(y0 + rad - py, 0, py - (y1 - rad));
        const dx = qx - Math.max(0, qx) * 0, dy = qy;
        const outside = Math.hypot(qx, qy) - rad;
        const cov = Math.max(0, Math.min(1, 0.5 - outside));
        if (qx > 0 || qy > 0) this.cov(xx, yy, cov, [cr,cg,cb,ca]);
        else this.blend(xx, yy, cr, cg, cb, ca / 255);
      }
  }
  poly(pts, c) {
    const [cr,cg,cb,ca] = hex(c);
    let minY = Infinity, maxY = -Infinity;
    for (const p of pts) { minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); }
    minY = Math.max(0, Math.floor(minY)); maxY = Math.min(this.h - 1, Math.ceil(maxY));
    for (let y = minY; y <= maxY; y++) {
      const yc = y + 0.5;
      const xs = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        if ((a[1] <= yc && b[1] > yc) || (b[1] <= yc && a[1] > yc)) {
          xs.push(a[0] + (yc - a[1]) / (b[1] - a[1]) * (b[0] - a[0]));
        }
      }
      xs.sort((p, q) => p - q);
      for (let i = 0; i + 1 < xs.length; i += 2) {
        const xa = Math.max(0, Math.floor(xs[i])), xb = Math.min(this.w - 1, Math.ceil(xs[i+1]));
        for (let x = xa; x <= xb; x++) {
          const cov = Math.min(1, Math.max(0, Math.min(x + 1, xs[i+1]) - Math.max(x, xs[i])));
          this.cov(x, y, cov, [cr,cg,cb,ca]);
        }
      }
    }
  }
  line(x1, y1, x2, y2, th, c) {
    const [cr,cg,cb,ca] = hex(c);
    const half = th / 2;
    const minX = Math.floor(Math.min(x1,x2) - half - 1), maxX = Math.ceil(Math.max(x1,x2) + half + 1);
    const minY = Math.floor(Math.min(y1,y2) - half - 1), maxY = Math.ceil(Math.max(y1,y2) + half + 1);
    const vx = x2 - x1, vy = y2 - y1, l2 = vx*vx + vy*vy || 1;
    for (let y = Math.max(0,minY); y <= Math.min(this.h-1,maxY); y++)
      for (let x = Math.max(0,minX); x <= Math.min(this.w-1,maxX); x++) {
        const px = x + 0.5, py = y + 0.5;
        let t = ((px - x1) * vx + (py - y1) * vy) / l2;
        t = Math.max(0, Math.min(1, t));
        const d = Math.hypot(px - (x1 + t * vx), py - (y1 + t * vy));
        const cov = Math.max(0, Math.min(1, half - d + 0.5));
        this.cov(x, y, cov, [cr,cg,cb,ca]);
      }
  }
  glow(cx, cy, r, c, strength) {
    const col = hex(c);
    const s = strength === undefined ? 1 : strength;
    for (let y = Math.floor(cy - r); y <= cy + r; y++)
      for (let x = Math.floor(cx - r); x <= cx + r; x++) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        if (d > r) continue;
        const k = Math.pow(1 - d / r, 2) * s;
        this.blend(x, y, col[0], col[1], col[2], col[3] / 255 * k);
      }
  }
  gradV(x, y, w, h, c1, c2) {
    const a = hex(c1), b = hex(c2);
    for (let yy = 0; yy < h; yy++) {
      const t = h <= 1 ? 0 : yy / (h - 1);
      const r = Math.round(a[0] + (b[0]-a[0])*t),
            g = Math.round(a[1] + (b[1]-a[1])*t),
            bl= Math.round(a[2] + (b[2]-a[2])*t),
            al= Math.round(a[3] + (b[3]-a[3])*t);
      for (let xx = 0; xx < w; xx++) this.blend(Math.floor(x)+xx, Math.floor(y)+yy, r, g, bl, al/255);
    }
  }
  save(file) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const raw = Buffer.alloc((this.w * 4 + 1) * this.h);
    for (let y = 0; y < this.h; y++) {
      raw[y * (this.w * 4 + 1)] = 0;
      this.d.copy(raw, y * (this.w * 4 + 1) + 1, y * this.w * 4, (y + 1) * this.w * 4);
    }
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(this.w, 0); ihdr.writeUInt32BE(this.h, 4);
    ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
    const png = Buffer.concat([
      Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]),
      chunk('IHDR', ihdr),
      chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
      chunk('IEND', Buffer.alloc(0)),
    ]);
    fs.writeFileSync(file, png);
    return png.length;
  }
}

function verify(file, w, h) {
  const b = fs.readFileSync(file);
  if (b.readUInt32BE(0) !== 0x89504e47) return 'bad magic';
  const W = b.readUInt32BE(16), H = b.readUInt32BE(20);
  if (W !== w || H !== h) return 'size ' + W + 'x' + H + ' != ' + w + 'x' + h;
  let p = 8, idat = [];
  while (p < b.length) {
    const len = b.readUInt32BE(p), type = b.slice(p+4, p+8).toString('latin1');
    if (type === 'IDAT') idat.push(b.slice(p+8, p+8+len));
    p += 12 + len;
  }
  try {
    const raw = zlib.inflateSync(Buffer.concat(idat));
    if (raw.length !== (W * 4 + 1) * H) return 'raw len mismatch';
  } catch (e) { return 'inflate fail: ' + e.message; }
  return 'ok';
}

module.exports = { Img, hex, verify };

/** 分层分支爬塔地图：战斗/精英/Boss/休息/商店/宝箱/事件 */
const ROWS = 12;
function rint(rnd, a, b) { return a + Math.floor(rnd() * (b - a + 1)); }
function genMap(act, rnd) {
  rnd = rnd || Math.random;
  const rows = [];
  for (let r = 0; r < ROWS; r++) {
    const count = rint(rnd, 2, 4);
    const nodes = [];
    const used = {};
    for (let c = 0; c < count; c++) {
      let type;
      if (r === 0) type = 'battle';
      else if (r === ROWS - 1) type = 'rest';
      else {
        const x = rnd();
        if (r >= 3 && r <= ROWS - 3 && x < 0.13) type = 'elite';
        else if (x < 0.26) type = 'event';
        else if (x < 0.40) type = 'rest';
        else if (x < 0.47 && !used.shop) { type = 'shop'; used.shop = 1; }
        else if (x < 0.54 && !used.chest) { type = 'chest'; used.chest = 1; }
        else type = 'battle';
      }
      nodes.push({ r: r, c: c, type: type, next: [] });
    }
    rows.push(nodes);
  }
  for (let r = 0; r < ROWS - 1; r++) {
    const cur = rows[r], nxt = rows[r + 1];
    const covered = new Set();
    for (const n of cur) {
      const lo = Math.max(0, n.c - 1), hi = Math.min(nxt.length - 1, n.c + 1);
      const first = rint(rnd, lo, hi);
      n.next.push(first); covered.add(first);
      if (rnd() < 0.35) {
        const second = rint(rnd, lo, hi);
        if (second !== first) { n.next.push(second); covered.add(second); }
      }
    }
    for (let c = 0; c < nxt.length; c++) {
      if (!covered.has(c)) {
        let best = 0, bd = 1e9;
        for (let i = 0; i < cur.length; i++) { const dd = Math.abs(i - c); if (dd < bd) { bd = dd; best = i; } }
        cur[best].next.push(c);
      }
    }
  }
  const boss = { r: ROWS, c: 0, type: 'boss', next: [] };
  for (const n of rows[ROWS - 1]) n.next.push(0);
  return { act: act, rows: rows, boss: boss };
}
function nodeAt(map, r, c) {
  if (r === ROWS) return map.boss;
  if (r < 0 || r >= map.rows.length) return null;
  const row = map.rows[r];
  return c >= 0 && c < row.length ? row[c] : null;
}
function canMove(map, curRow, curCol, nextRow, nextCol) {
  if (curRow === -1) return nextRow === 0;
  if (nextRow === curRow + 1) {
    if (curRow === ROWS - 1) return nextCol === 0;
    const n = nodeAt(map, curRow, curCol);
    return n ? n.next.includes(nextCol) : false;
  }
  return false;
}
const TYPE_NAME = { battle: '战斗', elite: '精英', boss: 'Boss', rest: '休息', shop: '商店', chest: '宝箱', event: '事件' };
module.exports = { genMap, nodeAt, canMove, TYPE_NAME, ROWS };

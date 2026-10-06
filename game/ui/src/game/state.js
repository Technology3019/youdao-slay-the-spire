/** 角色与爬塔进度状态 */
function b(n) { const a = []; for (let i = 0; i < n; i++) a.push({ id: 'b_strike', up: false }); return a; }
function d(n) { const a = []; for (let i = 0; i < n; i++) a.push({ id: 'b_defend', up: false }); return a; }
function expand(arr) { const out = []; for (const x of arr) { if (Array.isArray(x)) out.push(...x); else out.push(x); } return out; }

const CHARS = {
  ironclad: {
    id: 'ironclad', name: '铁甲战士', hp: 80, maxHp: 80, art: 'char_ironclad', portrait: 'char_ironclad_portrait',
    relic: 'relic_blood', desc: '力量·易伤·自伤',
    deck: [b(5), d(4), { id: 'b_bash', up: false }],
  },
  silent: {
    id: 'silent', name: '静默猎手', hp: 70, maxHp: 70, art: 'char_silent', portrait: 'char_silent_portrait',
    relic: 'relic_ring', desc: '中毒·弃牌·飞刀',
    deck: [b(5), d(5), { id: 'b_neutralize', up: false }, { id: 'b_survivor', up: false }],
  },
  defect: {
    id: 'defect', name: '故障机器人', hp: 72, maxHp: 72, art: 'char_defect', portrait: 'char_defect_portrait',
    relic: 'relic_core', desc: '充能球·集中',
    deck: [b(4), d(4), { id: 'b_zap', up: false }, { id: 'b_dualcast', up: false }],
  },
  watcher: {
    id: 'watcher', name: '观者', hp: 72, maxHp: 72, art: 'char_watcher', portrait: 'char_watcher_portrait',
    relic: 'relic_water', desc: '姿态·真言',
    deck: [b(4), d(4), { id: 'b_eruption', up: false }, { id: 'b_vigilance', up: false }],
  },
};
function createRun(charId, rnd) {
  const ch = CHARS[charId];
  if (!ch) return null;
  return {
    ver: 1, char: charId, charName: ch.name,
    hp: ch.hp, maxHp: ch.maxHp, gold: 99,
    deck: expand(ch.deck).map(x => ({ id: x.id, up: x.up })),
    relics: [ch.relic],
    act: 1, floor: 0,
    map: null, curRow: -1, curCol: -1,
    potions: [null, null],
    won: false, seed: Math.floor((rnd ? rnd() : Math.random()) * 1e9),
  };
}
module.exports = { CHARS, createRun, expand };

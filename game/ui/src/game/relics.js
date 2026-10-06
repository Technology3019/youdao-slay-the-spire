/**
 * 遗物（12）：4 角色专属起始 + 8 通用
 * hook: onCombatStart(b) / onTurnStart(b) / onTurnEnd(b) / onVictory(run) / onCombatEnd(b)
 */
const RELICS = [];
function R(o) { RELICS.push(o); return o; }

/* ---- 角色起始 ---- */
R({ id: 'relic_blood', name: '燃烧之血', char: 'ironclad', start: true, art: 'relic_blood',
    desc: '战斗结束后回复 6 点生命', hook: { onCombatEnd: b => { b.player.hp = Math.min(b.player.maxHp, b.player.hp + 6); } } });
R({ id: 'relic_ring', name: '蛇之戒指', char: 'silent', start: true, art: 'relic_ring',
    desc: '战斗开始时额外抽 2 张牌', hook: { onCombatStart: b => { b.extraDrawFirst = 2; } } });
R({ id: 'relic_core', name: '破损核心', char: 'defect', start: true, art: 'relic_core',
    desc: '战斗开始时生成 1 个闪电球', hook: { onCombatStart: b => { b.channelOrb('lightning'); } } });
R({ id: 'relic_water', name: '纯净之水', char: 'watcher', start: true, art: 'relic_water',
    desc: '战斗开始时获得 1 点真言', hook: { onCombatStart: b => { b.player.statuses.mantra = (b.player.statuses.mantra || 0) + 1; } } });

/* ---- 通用 ---- */
R({ id: 'relic_energy', name: '能量核心', art: 'relic_energy',
    desc: '每场战斗第 1 回合能量 +1', hook: { onTurnStart: b => { if (b.turn === 1) b.player.energy += 1; } } });
R({ id: 'relic_anchor', name: '铁锚', art: 'relic_anchor',
    desc: '战斗开始时获得 12 点格挡', hook: { onCombatStart: b => { b.player.block += 12; } } });
R({ id: 'relic_coin', name: '金币袋', art: 'relic_coin',
    desc: '战斗胜利后额外获得 20 金币', hook: { onVictory: run => { run.gold += 20; } } });
R({ id: 'relic_feather', name: '进化羽毛', art: 'relic_feather',
    desc: '每场战斗第 1 回合抽牌 +1', hook: { onCombatStart: b => { b.extraDrawFirst = (b.extraDrawFirst || 0) + 1; } } });
R({ id: 'relic_horn', name: '战争号角', art: 'relic_horn',
    desc: '战斗开始时获得 1 点力量', hook: { onCombatStart: b => { b.player.statuses.str = (b.player.statuses.str || 0) + 1; } } });
R({ id: 'relic_compass', name: '治愈罗盘', art: 'relic_compass',
    desc: '战斗胜利后回复 5 点生命', hook: { onVictory: run => { run.hp = Math.min(run.maxHp, run.hp + 5); } } });
R({ id: 'relic_crown', name: '勇气王冠', art: 'relic_crown',
    desc: '战斗开始时获得 2 点敏捷', hook: { onCombatStart: b => { b.player.statuses.dex = (b.player.statuses.dex || 0) + 2; } } });
R({ id: 'relic_charm', name: '守护护符', art: 'relic_charm',
    desc: '每回合结束时获得 3 点格挡', hook: { onTurnEnd: b => { b.gainBlock(b.player, 3); } } });

const RELIC_MAP = {};
for (const r of RELICS) RELIC_MAP[r.id] = r;
function getRelic(id) { return RELIC_MAP[id]; }
function randomRelics(n, owned, rnd) {
  const pool = RELICS.filter(r => !owned.includes(r.id));
  const out = [];
  while (out.length < n && pool.length) {
    const i = Math.floor(rnd() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

module.exports = { RELICS, RELIC_MAP, getRelic, randomRelics };

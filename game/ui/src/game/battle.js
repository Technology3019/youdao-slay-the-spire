/** 战斗引擎：抽牌/能量/Buff结算/充能球/姿态/意图 */
const cards = require('./cards.js');
const enemiesDb = require('./enemies.js');
const relicsDb = require('./relics.js');

let UID = 1;
function inst(id, up) { return { uid: UID++, id: id, up: !!up }; }
function shuffle(arr, rnd) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

const ORB_NAME = { lightning: '闪电', frost: '冰霜', dark: '黑暗' };
const STANCE_NAME = { anger: '愤怒', calm: '平静', divinity: '神性' };
const POWER_DESC = {
  strTurn: v => '每回合获得 ' + v + ' 点力量',
  poisonAll: v => '每回合对所有敌人施加 ' + v + ' 层中毒',
  blockTurn: v => '每回合获得 ' + v + ' 点格挡',
  energyCalm: v => '处于【平静】时回合结束获得 ' + v + ' 点能量',
  energyAnger: v => '处于【愤怒】时回合开始获得 ' + v + ' 点能量',
  blockCalm: v => '进入【平静】时获得 ' + v + ' 点格挡',
  selfRepair: v => '战斗结束后回复 ' + v + ' 点生命',
};
function fxDesc(f, up) {
  const v = cards.fxVal(f, up);
  switch (f.t) {
    case 'dmg': return '造成 ' + v + ' 点伤害' + (f.hits && f.hits > 1 ? '（' + f.hits + ' 次）' : '');
    case 'dmgAll': return '对所有敌人造成 ' + v + ' 点伤害' + (f.hits && f.hits > 1 ? '（' + f.hits + ' 次）' : '');
    case 'block': return '获得 ' + v + ' 点格挡';
    case 'draw': return '抽 ' + v + ' 张牌';
    case 'energy': return '获得 ' + v + ' 点能量';
    case 'str': return '获得 ' + v + ' 点力量';
    case 'dex': return '获得 ' + v + ' 点敏捷';
    case 'vuln': return '施加 ' + v + ' 层易伤';
    case 'weak': return '施加 ' + v + ' 层虚弱';
    case 'poison': return '施加 ' + v + ' 层中毒' + (f.hits && f.hits > 1 ? '（' + f.hits + ' 次）' : '');
    case 'heal': return '回复 ' + v + ' 点生命';
    case 'loseHp': return '失去 ' + v + ' 点生命';
    case 'mantra': return '获得 ' + v + ' 点真言';
    case 'stance': return '进入【' + STANCE_NAME[f.v] + '】姿态';
    case 'channel': return '生成 ' + v + ' 个' + ORB_NAME[f.orb] + '球';
    case 'evokeAll': return '释放所有充能球';
    case 'evokeTwice': return '重复释放最右侧充能球';
    case 'focus': return '获得 ' + v + ' 点集中';
    case 'shiv': return '获得 ' + v + ' 张飞刀';
    case 'discardSelf': return '弃 ' + v + ' 张牌';
    case 'dmgEqualBlock': return '造成等同于当前格挡的伤害';
    case 'blockEqualDmg': return '获得等同于本次伤害的格挡';
    case 'poisonDouble': return '翻倍敌人的中毒层数';
    case 'nextAttackDouble': return '下一次攻击伤害翻倍';
    case 'atkBonusStance': return '在【' + STANCE_NAME[f.st] + '】姿态下额外造成 ' + v + ' 点伤害';
    case 'blockStance': return '在【' + STANCE_NAME[f.st] + '】姿态下额外获得 ' + v + ' 点格挡';
    case 'power': return (POWER_DESC[f.k] || (() => ''))(v);
    default: return '';
  }
}
function renderDesc(c, up) { return c.fx.map(f => fxDesc(f, up)).filter(Boolean).join('，') + '。'; }

function createBattle(run, enemyIds, rnd) {
  rnd = rnd || Math.random;
  const b = {
    turn: 0, rnd: rnd, run: run, extraDrawFirst: 0, over: null, log: [],
    player: {
      hp: run.hp, maxHp: run.maxHp, block: 0, energy: 0, maxEnergy: 3,
      statuses: { str: 0, dex: 0, vuln: 0, weak: 0, poison: 0, mantra: 0, thorns: 0 },
      stance: null, orbs: [], focus: 0,
      hand: [], draw: [], discard: [], exhaust: [], powers: [],
      nextAttackDouble: false, cardsPlayedThisTurn: 0,
    },
    enemies: [],
  };
  for (const id of enemyIds) {
    const def = enemiesDb.getEnemy(id);
    if (!def) throw new Error('unknown enemy ' + id);
    const hp = Array.isArray(def.hp) ? (def.hp[0] + Math.floor(rnd() * (def.hp[1] - def.hp[0] + 1))) : def.hp;
    b.enemies.push({ def: def, hp: hp, maxHp: hp, block: 0, moveIdx: 0, alive: true,
      statuses: { str: 0, dex: 0, vuln: 0, weak: 0, poison: 0, thorns: 0 } });
  }
  for (const card of run.deck) b.player.draw.push(inst(card.id, card.up));
  shuffle(b.player.draw, b.rnd);
  b.channelOrb = function (o) { channelOrb(b, o); };
  b.gainBlock = function (w, v) { gainBlock(b, w, v); };
  return b;
}
function relicsHook(b, name, arg) {
  for (const id of (b.run.relics || [])) {
    const r = relicsDb.getRelic(id);
    if (r && r.hook && r.hook[name]) r.hook[name](arg === undefined ? b : arg);
  }
}
function drawCards(b, n) {
  const p = b.player;
  for (let i = 0; i < n; i++) {
    if (p.draw.length === 0) {
      if (p.discard.length === 0) break;
      p.draw = p.discard; p.discard = []; shuffle(p.draw, b.rnd);
    }
    const c = p.draw.pop();
    if (p.hand.length < 10) p.hand.push(c); else p.discard.push(c);
  }
}
function gainBlock(b, who, v) { if (v > 0) who.block += v; }
function aliveEnemies(b) { return b.enemies.filter(e => e.alive); }
function checkWin(b) {
  if (b.over) return;
  if (b.player.hp <= 0) { b.over = 'lose'; return; }
  if (b.enemies.every(e => !e.alive)) b.over = 'win';
}
function applyDamageTo(b, target, amount) {
  if (amount <= 0) return 0;
  let rest = amount;
  if (target.block > 0) {
    const absorbed = Math.min(target.block, rest);
    target.block -= absorbed; rest -= absorbed;
  }
  target.hp -= rest;
  if (target.hp <= 0) { target.hp = 0; if (target.alive !== undefined) target.alive = false; }
  return rest;
}
function dealAttackDamage(b, base, target, hits) {
  const p = b.player;
  let total = 0;
  for (let i = 0; i < (hits || 1); i++) {
    let d = base + (p.statuses.str || 0);
    if (p.stance === 'anger') d *= 2;
    if (p.stance === 'divinity') d *= 3;
    if (p.statuses.weak > 0) d *= 0.75;
    if (target.statuses.vuln > 0) d *= 1.5;
    d = Math.floor(d);
    if (p.nextAttackDouble) d *= 2;
    total += applyDamageTo(b, target, d);
  }
  p.nextAttackDouble = false;
  return total;
}
function dealToPlayer(b, base, hits) {
  const p = b.player;
  let total = 0;
  for (let i = 0; i < (hits || 1); i++) {
    let d = base;
    if (p.stance === 'anger') d = Math.floor(d * 2);
    if (p.stance === 'divinity') d = Math.floor(d * 1.5);
    total += applyDamageTo(b, p, d);
  }
  return total;
}
/* ---- 充能球 ---- */
function channelOrb(b, kind) {
  const p = b.player;
  const entry = { kind: kind, dark: 0 };
  if (p.orbs.length >= 3) { const old = p.orbs.shift(); evokeOrb(b, old); }
  p.orbs.push(entry);
}
function evokeOrb(b, orb) {
  if (!orb) return;
  const p = b.player;
  if (orb.kind === 'lightning') {
    const alive = aliveEnemies(b);
    if (alive.length) applyDamageTo(b, alive[Math.floor(b.rnd() * alive.length)], 8 + p.focus);
  } else if (orb.kind === 'frost') {
    gainBlock(b, p, 6 + p.focus);
  } else if (orb.kind === 'dark') {
    const alive = aliveEnemies(b);
    if (alive.length) { let t = alive[0]; for (const e of alive) if (e.hp < t.hp) t = e; applyDamageTo(b, t, orb.dark); }
  }
  checkWin(b);
}
function evokeRightmost(b, times) {
  const p = b.player;
  for (let i = 0; i < (times || 1); i++) {
    if (p.orbs.length === 0) break;
    const orb = p.orbs[p.orbs.length - 1];
    evokeOrb(b, orb);
  }
}
function evokeAllOrbs(b) {
  const p = b.player;
  while (p.orbs.length) evokeOrb(b, p.orbs.shift());
}
function triggerOrbsEndTurn(b) {
  const p = b.player;
  for (const orb of p.orbs) {
    if (orb.kind === 'lightning') {
      const alive = aliveEnemies(b);
      if (alive.length) applyDamageTo(b, alive[Math.floor(b.rnd() * alive.length)], 3 + p.focus);
    } else if (orb.kind === 'frost') gainBlock(b, p, 2 + p.focus);
    else if (orb.kind === 'dark') orb.dark += 5 + p.focus;
  }
  checkWin(b);
}
/* ---- 姿态/真言 ---- */
function setStance(b, st) {
  const p = b.player;
  if (p.stance === 'calm' && st !== 'calm') p.energy += 2;
  p.stance = st;
  for (const pw of p.powers) if (pw.k === 'blockCalm' && st === 'calm') gainBlock(b, p, pw.v);
  b.log.push('姿态变为【' + STANCE_NAME[st] + '】');
}
function addMantra(b, n) {
  const p = b.player;
  p.statuses.mantra += n;
  while (p.statuses.mantra >= 10) {
    p.statuses.mantra -= 10;
    setStance(b, 'divinity');
    p.energy += 3;
    b.log.push('真言圆满，进入神性并获得 3 点能量');
  }
}
/* ---- 出牌 ---- */
function canPlay(b, handIdx) {
  const c = b.player.hand[handIdx];
  if (!c) return false;
  return b.player.energy >= cards.getCard(c.id).cost;
}
function playCard(b, handIdx, targetIdx) {
  const p = b.player;
  const c = p.hand[handIdx];
  if (!c) return false;
  const def = cards.getCard(c.id);
  if (p.energy < def.cost) return false;
  let target = null;
  if (def.target === 'enemy') {
    const alive = aliveEnemies(b);
    if (alive.length === 0) return false;
    target = (b.enemies[targetIdx] && b.enemies[targetIdx].alive) ? b.enemies[targetIdx] : alive[0];
  }
  p.energy -= def.cost;
  p.hand.splice(handIdx, 1);
  p.cardsPlayedThisTurn++;
  b.log.push('打出【' + cards.cardName(def, c.up) + '】');
  resolveFx(b, def, c, target);
  if (def.type === 'power') {
    const pf = def.fx.find(f => f.t === 'power');
    p.powers.push({ k: pf.k, v: cards.fxVal(pf, c.up), card: def.id });
  } else if (def.exhaust) p.exhaust.push(c);
  else p.discard.push(c);
  checkWin(b);
  return true;
}
function resolveFx(b, def, c, target) {
  const p = b.player;
  const up = c.up;
  let lastDmg = 0;
  for (const f of def.fx) {
    const v = cards.fxVal(f, up);
    switch (f.t) {
      case 'dmg': if (target && target.alive) lastDmg = dealAttackDamage(b, v, target, f.hits); break;
      case 'dmgAll': { let t = 0; for (const e of aliveEnemies(b)) t += dealAttackDamage(b, v, e, f.hits); lastDmg = t; break; }
      case 'block': gainBlock(b, p, v + (p.statuses.dex || 0)); break;
      case 'draw': drawCards(b, v); break;
      case 'energy': p.energy += v; break;
      case 'str': p.statuses.str += v; break;
      case 'dex': p.statuses.dex += v; break;
      case 'vuln': if (target && target.alive) target.statuses.vuln += v; break;
      case 'weak': if (target && target.alive) target.statuses.weak += v; break;
      case 'poison':
        if (def.target === 'all') { for (const e of aliveEnemies(b)) e.statuses.poison += v; }
        else if (target && target.alive) { for (let i = 0; i < (f.hits || 1); i++) target.statuses.poison += v; }
        break;
      case 'heal': p.hp = Math.min(p.maxHp, p.hp + v); break;
      case 'loseHp': p.hp = Math.max(1, p.hp - v); break;
      case 'mantra': addMantra(b, v); break;
      case 'stance': setStance(b, f.v); break;
      case 'channel': for (let i = 0; i < v; i++) channelOrb(b, f.orb); break;
      case 'evokeTwice': evokeRightmost(b, 2); break;
      case 'evokeAll': evokeAllOrbs(b); break;
      case 'focus': p.focus += v; break;
      case 'shiv':
        for (let i = 0; i < v; i++) {
          const s = inst('t_shiv', false);
          if (p.hand.length < 10) p.hand.push(s); else p.discard.push(s);
        }
        break;
      case 'discardSelf': for (let i = 0; i < v && p.hand.length > 0; i++) p.discard.push(p.hand.pop()); break;
      case 'dmgEqualBlock': if (target && target.alive) lastDmg = dealAttackDamage(b, p.block, target, 1); break;
      case 'blockEqualDmg': gainBlock(b, p, lastDmg + (p.statuses.dex || 0)); break;
      case 'poisonDouble': if (target && target.alive) target.statuses.poison *= 2; break;
      case 'nextAttackDouble': p.nextAttackDouble = true; break;
      case 'atkBonusStance':
        if (target && target.alive && p.stance === f.st) applyDamageTo(b, target, Math.floor(v * (p.stance === 'anger' ? 2 : 1)));
        break;
      case 'blockStance': if (p.stance === f.st) gainBlock(b, p, v); break;
      default: break;
    }
  }
}
/* ---- 回合流程 ---- */
function startCombat(run, enemyIds, rnd) {
  const b = createBattle(run, enemyIds, rnd);
  relicsHook(b, 'onCombatStart');
  startTurn(b);
  return b;
}
function applyPlayerPowers(b, phase) {
  const p = b.player;
  for (const pw of p.powers) {
    if (phase === 'start' && pw.k === 'strTurn') p.statuses.str += pw.v;
    if (phase === 'start' && pw.k === 'poisonAll') for (const e of aliveEnemies(b)) e.statuses.poison += pw.v;
    if (phase === 'start' && pw.k === 'blockTurn') gainBlock(b, p, pw.v + (p.statuses.dex || 0));
    if (phase === 'start' && pw.k === 'energyAnger' && p.stance === 'anger') p.energy += pw.v;
    if (phase === 'end' && pw.k === 'energyCalm' && p.stance === 'calm') p.energy += pw.v;
    if (phase === 'end' && pw.k === 'selfRepair') p.hp = Math.min(p.maxHp, p.hp + pw.v);
  }
}
function startTurn(b) {
  const p = b.player;
  const first = b.turn === 0;
  b.turn++;
  if (!first) p.block = 0; else p.block = p.block; // 首回合保留战斗开始时获得的格挡
  p.energy = p.maxEnergy;
  p.cardsPlayedThisTurn = 0;
  if (p.statuses.poison > 0) {
    p.hp -= p.statuses.poison;
    b.log.push('中毒发作，失去 ' + p.statuses.poison + ' 点生命');
    p.statuses.poison -= 1;
  }
  applyPlayerPowers(b, 'start');
  relicsHook(b, 'onTurnStart');
  let drawN = 5;
  if (b.turn === 1) drawN += b.extraDrawFirst;
  drawCards(b, drawN);
  checkWin(b);
}
function endTurn(b) {
  const p = b.player;
  applyPlayerPowers(b, 'end');
  relicsHook(b, 'onTurnEnd');
  triggerOrbsEndTurn(b);
  if (p.stance === 'divinity') { p.stance = null; b.log.push('神性消退'); }
  if (p.statuses.vuln > 0) p.statuses.vuln -= 1;
  if (p.statuses.weak > 0) p.statuses.weak -= 1;
  p.discard = p.discard.concat(p.hand);
  p.hand = [];
  if (b.over) return;
  enemyTurn(b);
  if (!b.over) startTurn(b);
}
function currentMove(e) { return e.def.moves[e.moveIdx % e.def.moves.length]; }
function intentOf(e) {
  const m = currentMove(e);
  return { t: m.t, v: m.v, hits: m.hits, fx: m.fx };
}
function enemyTurn(b) {
  const p = b.player;
  for (const e of b.enemies) {
    if (!e.alive) continue;
    if (e.statuses.poison > 0) {
      e.hp -= e.statuses.poison;
      b.log.push(e.def.name + ' 中毒失去 ' + e.statuses.poison + ' 点生命');
      e.statuses.poison -= 1;
      if (e.hp <= 0) { e.hp = 0; e.alive = false; checkWin(b); if (b.over) return; continue; }
    }
    const m = currentMove(e);
    if (m.t === 'attack' || m.t === 'attackBuff') {
      let base = m.v + (e.statuses.str || 0);
      if (e.statuses.weak > 0) base = Math.floor(base * 0.75);
      const dealt = dealToPlayer(b, base, m.hits);
      b.log.push(e.def.name + ' 攻击造成 ' + dealt + ' 点伤害');
      if (p.statuses.thorns > 0) { e.hp -= p.statuses.thorns; if (e.hp <= 0) { e.hp = 0; e.alive = false; } }
      if (m.fx && m.fx.weak) { p.statuses.weak += m.fx.weak; b.log.push('你被施加 ' + m.fx.weak + ' 层虚弱'); }
      if (m.fx && m.fx.str) { e.statuses.str += m.fx.str; b.log.push(e.def.name + ' 力量 + ' + m.fx.str); }
    } else if (m.t === 'defend') {
      e.block += m.v;
      b.log.push(e.def.name + ' 获得 ' + m.v + ' 点格挡');
      if (m.fx && m.fx.str) { e.statuses.str += m.fx.str; b.log.push(e.def.name + ' 力量 + ' + m.fx.str); }
    } else if (m.t === 'buff') {
      if (m.fx && m.fx.str) { e.statuses.str += m.fx.str; b.log.push(e.def.name + ' 力量 + ' + m.fx.str); }
    } else if (m.t === 'debuff') {
      if (m.fx && m.fx.vuln) { p.statuses.vuln += m.fx.vuln; b.log.push('你被施加 ' + m.fx.vuln + ' 层易伤'); }
      if (m.fx && m.fx.weak) { p.statuses.weak += m.fx.weak; b.log.push('你被施加 ' + m.fx.weak + ' 层虚弱'); }
      if (m.fx && m.fx.poison) { p.statuses.poison += m.fx.poison; b.log.push('你被施加 ' + m.fx.poison + ' 层中毒'); }
    }
    e.block = 0;
    if (e.statuses.vuln > 0) e.statuses.vuln -= 1;
    if (e.statuses.weak > 0) e.statuses.weak -= 1;
    e.moveIdx++;
    checkWin(b);
    if (b.over) return;
  }
}
module.exports = {
  createBattle, startCombat, startTurn, endTurn, playCard, canPlay, drawCards,
  gainBlock, channelOrb, evokeOrb, evokeAllOrbs, evokeRightmost, triggerOrbsEndTurn,
  setStance, addMantra, dealAttackDamage, applyDamageTo, intentOf, currentMove,
  aliveEnemies, checkWin, renderDesc, fxDesc, inst, shuffle, STANCE_NAME, ORB_NAME,
};

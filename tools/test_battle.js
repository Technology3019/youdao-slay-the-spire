const st = require('/root/杀戮尖塔/game/ui/src/game/state.js');
const bt = require('/root/杀戮尖塔/game/ui/src/game/battle.js');
const cards = require('/root/杀戮尖塔/game/ui/src/game/cards.js');
const relicsDb = require('/root/杀戮尖塔/game/ui/src/game/relics.js');
let pass = 0, fail = 0;
function ok(cond, msg, extra) { if (cond) pass++; else { fail++; console.log('FAIL: ' + msg + (extra !== undefined ? ' | got=' + extra : '')); } }

/* 1) 铁甲战士 vs 大颚虫 */
const run1 = st.createRun('ironclad');
const b1 = bt.startCombat(run1, ['jaw_worm']);
ok(b1.turn === 1, 'turn 1');
ok(b1.player.hand.length === 5, 'draw 5', b1.player.hand.length);
ok(b1.player.energy === 3, 'energy 3', b1.player.energy);
let g = 0;
while (!b1.over && g++ < 60) {
  for (let i = b1.player.hand.length - 1; i >= 0; i--) {
    const def = cards.getCard(b1.player.hand[i].id);
    if (def.type === 'attack' && b1.player.energy >= def.cost) bt.playCard(b1, i, 0);
  }
  if (!b1.over) bt.endTurn(b1);
}
ok(b1.over === 'win', 'ironclad wins', b1.over);

/* 2) 故障机器人：球生成与触发 */
const b2 = bt.startCombat(st.createRun('defect'), ['acid_slime']);
bt.drawCards(b2, 10);
const zi = b2.player.hand.findIndex(c => c.id === 'b_zap');
ok(zi >= 0, 'found zap', zi);
if (zi >= 0) {
  bt.playCard(b2, zi, 0);
  ok(b2.player.orbs.length === 2 && b2.player.orbs.every(o => o.kind === 'lightning'), 'lightning x2 (core relic + zap)', JSON.stringify(b2.player.orbs));
  const hpBefore = b2.enemies[0].hp;
  bt.endTurn(b2);
  ok(b2.enemies[0].hp < hpBefore, 'orb trigger hurts enemy', hpBefore + '->' + b2.enemies[0].hp);
}

/* 3) 观者：姿态能量与真言 */
const run3 = st.createRun('watcher');
run3.deck = [{ id: 'b_vigilance', up: false }, { id: 'b_eruption', up: false }];
const b3 = bt.startCombat(run3, ['spike_slime']);
b3.player.energy = 2;
const vi = b3.player.hand.findIndex(c => c.id === 'b_vigilance');
ok(vi >= 0, 'has vigilance', vi);
bt.playCard(b3, vi, 0);
ok(b3.player.stance === 'calm', 'calm', b3.player.stance);
b3.player.energy = 2;
const er = b3.player.hand.findIndex(c => c.id === 'b_eruption');
ok(er >= 0, 'has eruption', er);
const played = bt.playCard(b3, er, 0);
ok(played === true, 'eruption playable', played);
ok(b3.player.stance === 'anger', 'anger', b3.player.stance);
ok(b3.player.energy === 2, 'calm refund 2-2+2=2', b3.player.energy);
bt.setStance(b3, 'calm');
bt.addMantra(b3, 10);
ok(b3.player.stance === 'divinity', 'divinity', b3.player.stance);
ok(b3.player.statuses.mantra === 1, 'mantra 1+10 -> 1 remainder (water relic gives 1)', b3.player.statuses.mantra);

/* 4) 中毒 + 催化 */
const run4 = st.createRun('silent');
run4.deck = [{ id: 's_deadlypoison', up: false }, { id: 's_catalyst', up: false }];
const b4 = bt.startCombat(run4, ['cultist']);
let pi = b4.player.hand.findIndex(c => c.id === 's_deadlypoison');
ok(pi >= 0, 'has deadly poison', pi);
bt.playCard(b4, pi, 0);
ok(b4.enemies[0].statuses.poison === 5, 'poison 5', b4.enemies[0].statuses.poison);
let ci = b4.player.hand.findIndex(c => c.id === 's_catalyst');
if (ci < 0) { bt.drawCards(b4, 3); ci = b4.player.hand.findIndex(c => c.id === 's_catalyst'); }
ok(ci >= 0, 'has catalyst', ci);
bt.playCard(b4, ci, 0);
ok(b4.enemies[0].statuses.poison === 10, 'poison x2 = 10', b4.enemies[0].statuses.poison);

/* 5) 遗物钩子 */
const run5 = st.createRun('ironclad');
run5.relics = ['relic_blood', 'relic_ring', 'relic_anchor', 'relic_horn'];
const b5 = bt.startCombat(run5, ['skeleton']);
ok(b5.player.block === 12, 'anchor block 12', b5.player.block);
ok(b5.player.statuses.str === 1, 'horn str 1', b5.player.statuses.str);
ok(b5.player.hand.length === 7, 'ring draw 7', b5.player.hand.length);
b5.player.hp = 30;
relicsDb.getRelic('relic_blood').hook.onCombatEnd(b5);
ok(b5.player.hp === 36, 'burning blood +6', b5.player.hp);

/* 6) 易伤数值 */
const run6 = st.createRun('ironclad');
run6.deck = [{ id: 'b_bash', up: false }, { id: 'b_strike', up: false }];
const b6 = bt.startCombat(run6, ['bandit']);
b6.player.energy = 10;
let bi = b6.player.hand.findIndex(c => c.id === 'b_bash');
ok(bi >= 0, 'has bash', bi);
bt.playCard(b6, bi, 0);
ok(b6.enemies[0].statuses.vuln === 2, 'vuln 2', b6.enemies[0].statuses.vuln);
const hp1 = b6.enemies[0].hp;
let si = b6.player.hand.findIndex(c => c.id === 'b_strike');
if (si < 0) { bt.drawCards(b6, 3); si = b6.player.hand.findIndex(c => c.id === 'b_strike'); }
bt.playCard(b6, si, 0);
ok(hp1 - b6.enemies[0].hp === 9, 'vuln strike 9', hp1 - b6.enemies[0].hp);

/* 7) 意图与失败路径 */
const run7 = st.createRun('silent');
run7.hp = 1;
const b7 = bt.startCombat(run7, ['brute']);
const it = bt.intentOf(b7.enemies[0]);
ok(['attack', 'defend', 'buff', 'debuff', 'attackBuff'].includes(it.t), 'intent valid', it.t);
g = 0;
while (!b7.over && g++ < 80) bt.endTurn(b7);
ok(b7.over === 'lose', 'loses at 1hp', b7.over);

/* 8) 描述渲染 */
const cBash = cards.getCard('b_bash');
const d0 = bt.renderDesc(cBash, false), d1 = bt.renderDesc(cBash, true);
ok(d0.includes('8') && d0.includes('易伤'), 'desc base', d0);
ok(d1.includes('11'), 'desc up', d1);
const cardIds = cards.CARDS.map(c => c.id);
ok(new Set(cardIds).size === cardIds.length, 'no dup card ids');

console.log('PASS=' + pass + ' FAIL=' + fail);
process.exit(fail ? 1 : 0);

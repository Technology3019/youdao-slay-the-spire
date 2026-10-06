/** 事件节点数据：choices[].fx(run) 直接改状态，返回提示文本 */
const relicsDb = require('./relics.js');
function addRandomRelic(run) {
  const rnd = relicsDb.randomRelics(1, run.relics, Math.random);
  if (rnd.length) { run.relics.push(rnd[0].id); return rnd[0].name; }
  run.gold += 50; return '无可用遗物，获得 50 金币';
}
const EVENTS = [
  {
    id: 'altar', title: '恶魔祭坛', text: '黑石祭坛上燃烧着幽绿的火焰，一个声音低语着力量的代价……',
    choices: [
      { label: '献祭（失去 7 生命）', fx: run => { run.hp = Math.max(1, run.hp - 7); const n = poolRandom(run); return n ? '获得卡牌【' + n + '】' : '牌池已空'; } },
      { label: '离开', fx: () => '你谨慎地退开了。' },
    ],
  },
  {
    id: 'fountain', title: '金币喷泉', text: '庭院中央的喷泉里洒出的不是水，而是闪闪发光的金币。',
    choices: [
      { label: '装满口袋（+40 金币）', fx: run => { run.gold += 40; return '获得 40 金币'; } },
      { label: '砸开雕像（+80 金币，失去 5 生命）', fx: run => { run.gold += 80; run.hp = Math.max(1, run.hp - 5); return '获得 80 金币，失去 5 生命'; } },
      { label: '离开', fx: () => '你没有贪心。' },
    ],
  },
  {
    id: 'stele', title: '神秘石碑', text: '刻满符文的石碑似乎能让卡牌变得更强，也可能吞噬你的收藏。',
    choices: [
      { label: '研读（随机升级一张牌）', fx: run => { const cand = run.deck.filter(c => !c.up); if (!cand.length) return '没有可升级的牌'; const c = cand[Math.floor(Math.random() * cand.length)]; c.up = true; return '升级了一张牌'; } },
      { label: '拓印（移除一张随机牌，+50 金币）', fx: run => { if (run.deck.length <= 5) return '牌组太薄了'; const i = Math.floor(Math.random() * run.deck.length); const g = run.deck.splice(i, 1)[0]; run.gold += 50; return '移除 1 张牌，获得 50 金币'; } },
      { label: '离开', fx: () => '你离开了石碑。' },
    ],
  },
  {
    id: 'traveler', title: '受伤的旅人', text: '一名冒险者倒在地上，他请求你帮忙治疗他的伤口。',
    choices: [
      { label: '救治（-40 金币，回复 20 生命）', fx: run => { if (run.gold < 40) return '金币不足'; run.gold -= 40; run.hp = Math.min(run.maxHp, run.hp + 20); return '回复 20 生命'; } },
      { label: '搜刮（+30 金币）', fx: run => { run.gold += 30; return '拿走了他 30 金币'; } },
      { label: '离开', fx: () => '你点了点头走开了。' },
    ],
  },
];
function poolRandom(run) {
  const cards = require('./cards.js');
  const pool = cards.CARDS.filter(c => c.char === run.char && c.rarity !== 'basic' && c.rarity !== 'special');
  if (!pool.length) return null;
  const c = pool[Math.floor(Math.random() * pool.length)];
  run.deck.push({ id: c.id, up: false });
  return c.name;
}
function pickEvent() { return EVENTS[Math.floor(Math.random() * EVENTS.length)]; }
module.exports = { EVENTS, pickEvent };

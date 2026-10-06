/**
 * 敌人数据库
 * moves: 行动表（按序循环，ai 可覆盖）
 *   {t:'attack', v, hits?} 攻击  {t:'defend', v} 格挡
 *   {t:'buff', fx:{str?}} 自身增益  {t:'debuff', fx:{vuln?/weak?/poison?}}  强化攻击 {t:'attackBuff', v, fx}
 * art: 对应 ui/src/assets/img/<art>.png
 */
const ENEMIES = [];
function E(o) { ENEMIES.push(o); return o; }

/* ---- 第一幕普通 ---- */
E({ id: 'jaw_worm', name: '大颚虫', tier: 'normal', act: 1, hp: [14, 22], art: 'enemy_jaw_worm',
    moves: [{ t: 'attack', v: 11 }, { t: 'defend', v: 6 }, { t: 'attack', v: 7, fx: { str: 2 } }] });
E({ id: 'acid_slime', name: '酸液史莱姆', tier: 'normal', act: 1, hp: [10, 16], art: 'enemy_acid_slime',
    moves: [{ t: 'attack', v: 8 }, { t: 'attack', v: 5, fx: { weak: 2 } }, { t: 'defend', v: 5 }] });
E({ id: 'spike_slime', name: '尖刺史莱姆', tier: 'normal', act: 1, hp: [12, 18], art: 'enemy_spike_slime',
    moves: [{ t: 'attack', v: 7 }, { t: 'defend', v: 6 }, { t: 'attack', v: 9 }] });
E({ id: 'bandit', name: '强盗', tier: 'normal', act: 1, hp: [16, 24], art: 'enemy_bandit',
    moves: [{ t: 'attack', v: 9 }, { t: 'attackBuff', v: 6, fx: { str: 2 } }, { t: 'attack', v: 6 }] });
E({ id: 'cultist', name: '狂信徒', tier: 'normal', act: 1, hp: [18, 26], art: 'enemy_cultist',
    moves: [{ t: 'buff', fx: { str: 3 } }, { t: 'attack', v: 9 }, { t: 'attack', v: 9 }] });
E({ id: 'skeleton', name: '骷髅兵', tier: 'normal', act: 1, hp: [14, 20], art: 'enemy_skeleton',
    moves: [{ t: 'attack', v: 7 }, { t: 'defend', v: 5 }, { t: 'attack', v: 10 }] });

/* ---- 第二幕普通 ---- */
E({ id: 'slave', name: '被缚奴隶', tier: 'normal', act: 2, hp: [26, 34], art: 'enemy_slave',
    moves: [{ t: 'attack', v: 12 }, { t: 'defend', v: 9 }, { t: 'attack', v: 9, fx: { str: 2 } }] });
E({ id: 'gargoyle', name: '石像鬼', tier: 'normal', act: 2, hp: [30, 40], art: 'enemy_gargoyle',
    moves: [{ t: 'defend', v: 12 }, { t: 'attack', v: 15 }, { t: 'attack', v: 11 }] });
E({ id: 'ghost', name: '幽灵', tier: 'normal', act: 2, hp: [22, 30], art: 'enemy_ghost',
    moves: [{ t: 'attack', v: 11, fx: { weak: 2 } }, { t: 'attack', v: 11 }, { t: 'defend', v: 8 }] });

/* ---- 第三幕普通 ---- */
E({ id: 'shadow', name: '暗影哨兵', tier: 'normal', act: 3, hp: [40, 52], art: 'enemy_shadow',
    moves: [{ t: 'attack', v: 15 }, { t: 'debuff', fx: { vuln: 2 } }, { t: 'attack', v: 18 }] });
E({ id: 'imp', name: '小恶魔', tier: 'normal', act: 3, hp: [34, 46], art: 'enemy_imp',
    moves: [{ t: 'attack', v: 13 }, { t: 'attackBuff', v: 8, fx: { str: 3 } }, { t: 'attack', v: 13 }] });
E({ id: 'fungus', name: '蘑菇怪', tier: 'normal', act: 3, hp: [36, 48], art: 'enemy_fungus',
    moves: [{ t: 'attack', v: 10, fx: { poison: 3 } }, { t: 'defend', v: 12 }, { t: 'attack', v: 14 }] });

/* ---- 精英 ---- */
E({ id: 'brute', name: '暴怒蛮魔', tier: 'elite', act: 1, hp: [68, 76], art: 'elite_brute',
    moves: [{ t: 'attack', v: 16 }, { t: 'buff', fx: { str: 3 } }, { t: 'attack', v: 14 }] });
E({ id: 'golem', name: '石像守卫', tier: 'elite', act: 2, hp: [84, 92], art: 'elite_golem',
    moves: [{ t: 'defend', v: 14, fx: { str: 1 } }, { t: 'attack', v: 20 }, { t: 'attack', v: 16 }] });
E({ id: 'witch', name: '堕落女巫', tier: 'elite', act: 3, hp: [88, 96], art: 'elite_witch',
    moves: [{ t: 'attack', v: 12, fx: { weak: 2 } }, { t: 'buff', fx: { str: 3 } }, { t: 'attack', v: 18 }] });

/* ---- Boss ---- */
E({ id: 'slime_king', name: '史莱姆之王', tier: 'boss', act: 1, hp: [150, 150], art: 'boss_slime_king',
    moves: [{ t: 'attack', v: 14 }, { t: 'defend', v: 16 }, { t: 'attack', v: 9, hits: 2 }, { t: 'debuff', fx: { weak: 2 } }] });
E({ id: 'guardian', name: '守护者', tier: 'boss', act: 2, hp: [200, 200], art: 'boss_guardian',
    moves: [{ t: 'attack', v: 18 }, { t: 'defend', v: 22, fx: { str: 1 } }, { t: 'attack', v: 24 }] });
E({ id: 'collector', name: '收藏家', tier: 'boss', act: 3, hp: [240, 240], art: 'boss_collector',
    moves: [{ t: 'attack', v: 11, hits: 2 }, { t: 'buff', fx: { str: 3 } }, { t: 'attack', v: 20 }, { t: 'debuff', fx: { vuln: 2 } }] });

const ENEMY_MAP = {};
for (const e of ENEMIES) ENEMY_MAP[e.id] = e;
function getEnemy(id) { return ENEMY_MAP[id]; }
function poolBy(act, tier) { return ENEMIES.filter(e => e.tier === tier && e.act === act); }

module.exports = { ENEMIES, ENEMY_MAP, getEnemy, poolBy };

/**
 * 卡牌数据库
 * fx 效果键：
 *  dmg{v,hits} 单体伤害 / dmgAll{v,hits} 全体伤害 / block 格挡 / draw 抽牌 / energy 能量
 *  str 力量 / dex 敏捷 / vuln 易伤 / weak 虚弱 / poison 中毒 / heal 回复 / loseHp 自伤
 *  mantra 真言 / stance{v} 切姿态 / channel{v,orb} 生成充能球 / evokeAll 释放全部球
 *  focus 集中 / shiv{v} 获得飞刀 / discardSelf 弃 self 张 / dmgEqualBlock 盾猛
 *  poisonDouble 翻倍中毒 / nextAttackDouble 下次攻击翻倍 / atkBonusStance{v,st} 特定姿态加伤
 *  blockStance{v,st} 特定姿态加格挡 / power{k,v} 持续能力
 * power 键：strTurn 每回合力量 / poisonAll 每回合全体中毒 / blockTurn 每回合格挡
 *          energyCalm 平静回能 / energyAnger 愤怒回能 / blockCalm 进平静格挡 / selfRepair 战后回血
 * u = 升级后的值；有 u 的卡可升级，卡名升级后加 "+"
 */
const CARDS = [];
function C(o) { CARDS.push(o); return o; }

/* ============ 通用基础牌 ============ */
C({ id: 'b_strike', name: '打击', cost: 1, type: 'attack', rarity: 'basic', char: 'colorless', target: 'enemy',
    fx: [{ t: 'dmg', v: 6, u: 9 }] });
C({ id: 'b_defend', name: '防御', cost: 1, type: 'skill', rarity: 'basic', char: 'colorless', target: 'self',
    fx: [{ t: 'block', v: 5, u: 8 }] });
C({ id: 't_shiv', name: '飞刀', cost: 0, type: 'attack', rarity: 'special', char: 'silent', target: 'enemy', exhaust: true,
    fx: [{ t: 'dmg', v: 4, u: 6 }] });

/* ============ 铁甲战士基础 ============ */
C({ id: 'b_bash', name: '痛击', cost: 2, type: 'attack', rarity: 'basic', char: 'ironclad', target: 'enemy',
    fx: [{ t: 'dmg', v: 8, u: 11 }, { t: 'vuln', v: 2, u: 3 }] });

/* ============ 静默猎手基础 ============ */
C({ id: 'b_neutralize', name: '中和', cost: 0, type: 'attack', rarity: 'basic', char: 'silent', target: 'enemy',
    fx: [{ t: 'dmg', v: 3, u: 5 }, { t: 'weak', v: 1, u: 2 }] });
C({ id: 'b_survivor', name: '生存者', cost: 1, type: 'skill', rarity: 'basic', char: 'silent', target: 'self',
    fx: [{ t: 'block', v: 6, u: 9 }, { t: 'discardSelf', v: 1 }] });

/* ============ 故障机器人基础 ============ */
C({ id: 'b_zap', name: '电球', cost: 1, type: 'skill', rarity: 'basic', char: 'defect', target: 'self',
    fx: [{ t: 'channel', v: 1, orb: 'lightning' }] });
C({ id: 'b_dualcast', name: '双重释放', cost: 1, type: 'skill', rarity: 'basic', char: 'defect', target: 'self',
    fx: [{ t: 'evokeTwice' }] });

/* ============ 观者基础 ============ */
C({ id: 'b_eruption', name: '暴怒', cost: 2, type: 'attack', rarity: 'basic', char: 'watcher', target: 'enemy',
    fx: [{ t: 'dmg', v: 9, u: 12 }, { t: 'stance', v: 'anger' }] });
C({ id: 'b_vigilance', name: '警惕', cost: 2, type: 'skill', rarity: 'basic', char: 'watcher', target: 'self',
    fx: [{ t: 'block', v: 8, u: 11 }, { t: 'stance', v: 'calm' }] });

/* ============ 无色牌 9 张 ============ */
C({ id: 'c_escape', name: '闪避', cost: 1, type: 'skill', rarity: 'colorless', char: 'colorless', target: 'self',
    fx: [{ t: 'block', v: 7, u: 10 }] });
C({ id: 'c_smash', name: '猛击', cost: 2, type: 'attack', rarity: 'colorless', char: 'colorless', target: 'enemy',
    fx: [{ t: 'dmg', v: 14, u: 18 }] });
C({ id: 'c_warcry', name: '战吼', cost: 1, type: 'skill', rarity: 'colorless', char: 'colorless', target: 'self',
    fx: [{ t: 'draw', v: 2, u: 3 }] });
C({ id: 'c_firstaid', name: '急救', cost: 1, type: 'skill', rarity: 'colorless', char: 'colorless', target: 'self',
    fx: [{ t: 'heal', v: 6, u: 9 }] });
C({ id: 'c_shatter', name: '破甲', cost: 1, type: 'skill', rarity: 'colorless', char: 'colorless', target: 'enemy',
    fx: [{ t: 'vuln', v: 2, u: 3 }] });
C({ id: 'c_surge', name: '汹涌', cost: 0, type: 'skill', rarity: 'colorless', char: 'colorless', target: 'self',
    fx: [{ t: 'energy', v: 1, u: 2 }] });
C({ id: 'c_sharpen', name: '磨利', cost: 1, type: 'skill', rarity: 'colorless', char: 'colorless', target: 'self',
    fx: [{ t: 'str', v: 1, u: 2 }] });
C({ id: 'c_hex', name: '诅咒', cost: 1, type: 'attack', rarity: 'colorless', char: 'colorless', target: 'enemy',
    fx: [{ t: 'dmg', v: 8, u: 11 }, { t: 'weak', v: 1, u: 2 }] });
C({ id: 'c_luck', name: '幸运', cost: 1, type: 'skill', rarity: 'colorless', char: 'colorless', target: 'self',
    fx: [{ t: 'draw', v: 1, u: 2 }, { t: 'energy', v: 0, u: 1 }] });

/* ============ 铁甲战士 15 张 ============ */
C({ id: 'i_cleave', name: '横扫', cost: 1, type: 'attack', rarity: 'common', char: 'ironclad', target: 'all',
    fx: [{ t: 'dmgAll', v: 8, u: 11 }] });
C({ id: 'i_uppercut', name: '上勾拳', cost: 3, type: 'attack', rarity: 'uncommon', char: 'ironclad', target: 'enemy',
    fx: [{ t: 'dmg', v: 13, u: 17 }, { t: 'weak', v: 1, u: 2 }, { t: 'vuln', v: 1, u: 2 }] });
C({ id: 'i_inflame', name: '燃烧', cost: 1, type: 'power', rarity: 'uncommon', char: 'ironclad', target: 'self',
    fx: [{ t: 'str', v: 2, u: 3 }] });
C({ id: 'i_ironwave', name: '铁波', cost: 1, type: 'attack', rarity: 'common', char: 'ironclad', target: 'enemy',
    fx: [{ t: 'dmg', v: 5, u: 8 }, { t: 'block', v: 5, u: 8 }] });
C({ id: 'i_twin', name: '双击', cost: 1, type: 'attack', rarity: 'common', char: 'ironclad', target: 'enemy',
    fx: [{ t: 'dmg', v: 5, u: 7, hits: 2 }] });
C({ id: 'i_bloodletting', name: '放血', cost: 1, type: 'skill', rarity: 'common', char: 'ironclad', target: 'self',
    fx: [{ t: 'loseHp', v: 3 }, { t: 'energy', v: 2 }] });
C({ id: 'i_bodyslam', name: '盾猛', cost: 1, type: 'attack', rarity: 'common', char: 'ironclad', target: 'enemy',
    fx: [{ t: 'dmgEqualBlock' }] });
C({ id: 'i_shockwave', name: '震荡波', cost: 2, type: 'skill', rarity: 'uncommon', char: 'ironclad', target: 'all',
    fx: [{ t: 'weak', v: 3, u: 5 }, { t: 'vuln', v: 3, u: 5 }] });
C({ id: 'i_heavyblade', name: '重刃', cost: 2, type: 'attack', rarity: 'common', char: 'ironclad', target: 'enemy',
    fx: [{ t: 'dmg', v: 14, u: 18 }] });
C({ id: 'i_impervious', name: '不可阻挡', cost: 2, type: 'skill', rarity: 'rare', char: 'ironclad', target: 'self',
    fx: [{ t: 'block', v: 15, u: 20 }] });
C({ id: 'i_demonform', name: '恶魔之形', cost: 3, type: 'power', rarity: 'rare', char: 'ironclad', target: 'self',
    fx: [{ t: 'power', k: 'strTurn', v: 2, u: 3 }] });
C({ id: 'i_bludgeon', name: '重锤', cost: 3, type: 'attack', rarity: 'rare', char: 'ironclad', target: 'enemy',
    fx: [{ t: 'dmg', v: 24, u: 32 }] });
C({ id: 'i_reaper', name: '死神之镰', cost: 2, type: 'attack', rarity: 'rare', char: 'ironclad', target: 'enemy',
    fx: [{ t: 'dmg', v: 6, u: 9 }, { t: 'heal', v: 4, u: 6 }] });
C({ id: 'i_anger', name: '怒火', cost: 0, type: 'attack', rarity: 'uncommon', char: 'ironclad', target: 'enemy',
    fx: [{ t: 'dmg', v: 6, u: 9 }, { t: 'stance', v: 'anger' }] });
C({ id: 'i_ghostarmor', name: '幽灵护甲', cost: 1, type: 'skill', rarity: 'uncommon', char: 'ironclad', target: 'self',
    fx: [{ t: 'block', v: 10, u: 14 }] });

/* ============ 静默猎手 15 张 ============ */
C({ id: 's_catalyst', name: '催化', cost: 1, type: 'skill', rarity: 'uncommon', char: 'silent', target: 'enemy',
    fx: [{ t: 'poisonDouble' }] });
C({ id: 's_deadlypoison', name: '致命毒药', cost: 1, type: 'skill', rarity: 'common', char: 'silent', target: 'enemy',
    fx: [{ t: 'poison', v: 5, u: 8 }] });
C({ id: 's_bounceflask', name: '弹跳瓶', cost: 2, type: 'skill', rarity: 'uncommon', char: 'silent', target: 'all',
    fx: [{ t: 'poison', v: 3, u: 4, hits: 3 }] });
C({ id: 's_terror', name: '恐惧', cost: 1, type: 'skill', rarity: 'common', char: 'silent', target: 'enemy',
    fx: [{ t: 'vuln', v: 3, u: 5 }] });
C({ id: 's_daggerthrow', name: '飞刀投掷', cost: 1, type: 'attack', rarity: 'common', char: 'silent', target: 'enemy',
    fx: [{ t: 'dmg', v: 6, u: 9 }, { t: 'draw', v: 1 }] });
C({ id: 's_backflip', name: '后空翻', cost: 1, type: 'skill', rarity: 'common', char: 'silent', target: 'self',
    fx: [{ t: 'block', v: 5, u: 8 }, { t: 'draw', v: 2 }] });
C({ id: 's_suckerpunch', name: '意外打击', cost: 1, type: 'attack', rarity: 'common', char: 'silent', target: 'enemy',
    fx: [{ t: 'dmg', v: 8, u: 11 }, { t: 'weak', v: 1, u: 2 }] });
C({ id: 's_bladedance', name: '刀刃之舞', cost: 1, type: 'skill', rarity: 'common', char: 'silent', target: 'self',
    fx: [{ t: 'shiv', v: 3, u: 4 }] });
C({ id: 's_dodgeroll', name: '翻滚', cost: 1, type: 'skill', rarity: 'common', char: 'silent', target: 'self',
    fx: [{ t: 'block', v: 4, u: 7 }, { t: 'draw', v: 1 }] });
C({ id: 's_noxiousfumes', name: '恶臭', cost: 1, type: 'power', rarity: 'uncommon', char: 'silent', target: 'self',
    fx: [{ t: 'power', k: 'poisonAll', v: 2, u: 3 }] });
C({ id: 's_afterimage', name: '残影', cost: 1, type: 'power', rarity: 'rare', char: 'silent', target: 'self',
    fx: [{ t: 'power', k: 'blockTurn', v: 3, u: 4 }] });
C({ id: 's_finisher', name: '终结', cost: 2, type: 'attack', rarity: 'common', char: 'silent', target: 'enemy',
    fx: [{ t: 'dmg', v: 10, u: 14 }] });
C({ id: 's_phantom', name: '幻影杀手', cost: 1, type: 'skill', rarity: 'rare', char: 'silent', target: 'self',
    fx: [{ t: 'nextAttackDouble' }] });
C({ id: 's_bullettime', name: '子弹时间', cost: 2, type: 'skill', rarity: 'rare', char: 'silent', target: 'self',
    fx: [{ t: 'draw', v: 3, u: 4 }] });
C({ id: 's_dietodie', name: '至死方休', cost: 1, type: 'attack', rarity: 'uncommon', char: 'silent', target: 'all',
    fx: [{ t: 'dmgAll', v: 11, u: 15 }] });

/* ============ 故障机器人 15 张 ============ */
C({ id: 'd_balllightning', name: '电光', cost: 1, type: 'attack', rarity: 'common', char: 'defect', target: 'enemy',
    fx: [{ t: 'dmg', v: 7, u: 10 }, { t: 'channel', v: 1, orb: 'lightning' }] });
C({ id: 'd_coldsnap', name: '冷触', cost: 1, type: 'attack', rarity: 'common', char: 'defect', target: 'enemy',
    fx: [{ t: 'dmg', v: 6, u: 9 }, { t: 'channel', v: 1, orb: 'frost' }] });
C({ id: 'd_glacier', name: '冰川', cost: 2, type: 'skill', rarity: 'uncommon', char: 'defect', target: 'self',
    fx: [{ t: 'block', v: 7, u: 10 }, { t: 'channel', v: 2, orb: 'frost' }] });
C({ id: 'd_static', name: '静电释放', cost: 1, type: 'skill', rarity: 'common', char: 'defect', target: 'self',
    fx: [{ t: 'block', v: 3, u: 5 }, { t: 'channel', v: 1, orb: 'lightning' }] });
C({ id: 'd_beam', name: '光束', cost: 1, type: 'attack', rarity: 'common', char: 'defect', target: 'enemy',
    fx: [{ t: 'dmg', v: 9, u: 12 }] });
C({ id: 'd_coolheaded', name: '冷静', cost: 1, type: 'skill', rarity: 'common', char: 'defect', target: 'self',
    fx: [{ t: 'draw', v: 2, u: 3 }, { t: 'channel', v: 1, orb: 'frost' }] });
C({ id: 'd_fission', name: '裂变', cost: 1, type: 'skill', rarity: 'uncommon', char: 'defect', target: 'self',
    fx: [{ t: 'evokeAll' }] });
C({ id: 'd_electro', name: '电动力学', cost: 2, type: 'power', rarity: 'rare', char: 'defect', target: 'self',
    fx: [{ t: 'channel', v: 2, orb: 'lightning' }] });
C({ id: 'd_focusup', name: '聚焦', cost: 3, type: 'power', rarity: 'rare', char: 'defect', target: 'self',
    fx: [{ t: 'focus', v: 2, u: 3 }] });
C({ id: 'd_defragment', name: '散射', cost: 1, type: 'power', rarity: 'uncommon', char: 'defect', target: 'self',
    fx: [{ t: 'focus', v: 1, u: 2 }] });
C({ id: 'd_reprogram', name: '重写', cost: 1, type: 'power', rarity: 'uncommon', char: 'defect', target: 'self',
    fx: [{ t: 'focus', v: -1 }, { t: 'str', v: 2, u: 3 }, { t: 'dex', v: 2, u: 3 }] });
C({ id: 'd_bias', name: '偏见', cost: 2, type: 'power', rarity: 'rare', char: 'defect', target: 'self',
    fx: [{ t: 'focus', v: 2, u: 3 }] });
C({ id: 'd_darkshade', name: '暗影', cost: 1, type: 'skill', rarity: 'common', char: 'defect', target: 'self',
    fx: [{ t: 'channel', v: 1, orb: 'dark' }] });
C({ id: 'd_reboot', name: '重置', cost: 1, type: 'skill', rarity: 'uncommon', char: 'defect', target: 'self',
    fx: [{ t: 'draw', v: 3, u: 4 }] });
C({ id: 'd_selfrepair', name: '自我修复', cost: 1, type: 'power', rarity: 'rare', char: 'defect', target: 'self',
    fx: [{ t: 'power', k: 'selfRepair', v: 4, u: 6 }] });

/* ============ 观者 15 张 ============ */
C({ id: 'w_crushjoints', name: '碎关节', cost: 1, type: 'attack', rarity: 'common', char: 'watcher', target: 'enemy',
    fx: [{ t: 'dmg', v: 8, u: 11 }, { t: 'vuln', v: 2, u: 3 }] });
C({ id: 'w_followup', name: '连击', cost: 1, type: 'attack', rarity: 'common', char: 'watcher', target: 'enemy',
    fx: [{ t: 'dmg', v: 7, u: 10 }, { t: 'atkBonusStance', v: 5, st: 'anger' }] });
C({ id: 'w_sashwhip', name: '鞭笞', cost: 1, type: 'attack', rarity: 'common', char: 'watcher', target: 'enemy',
    fx: [{ t: 'dmg', v: 9, u: 12 }, { t: 'weak', v: 2, u: 3 }] });
C({ id: 'w_consecrate', name: '奉献', cost: 1, type: 'attack', rarity: 'common', char: 'watcher', target: 'all',
    fx: [{ t: 'dmgAll', v: 5, u: 8 }] });
C({ id: 'w_collect', name: '集中', cost: 0, type: 'skill', rarity: 'common', char: 'watcher', target: 'self',
    fx: [{ t: 'mantra', v: 2, u: 3 }] });
C({ id: 'w_meditate', name: '冥想', cost: 1, type: 'skill', rarity: 'uncommon', char: 'watcher', target: 'self',
    fx: [{ t: 'stance', v: 'calm' }, { t: 'draw', v: 1 }] });
C({ id: 'w_nirvana', name: '涅槃', cost: 1, type: 'power', rarity: 'uncommon', char: 'watcher', target: 'self',
    fx: [{ t: 'power', k: 'blockCalm', v: 4, u: 6 }] });
C({ id: 'w_rushdown', name: '疾冲', cost: 2, type: 'power', rarity: 'rare', char: 'watcher', target: 'self',
    fx: [{ t: 'power', k: 'energyAnger', v: 1, u: 1 }] });
C({ id: 'w_innerpeace', name: '内在平静', cost: 1, type: 'power', rarity: 'uncommon', char: 'watcher', target: 'self',
    fx: [{ t: 'power', k: 'energyCalm', v: 1, u: 1 }] });
C({ id: 'w_windmill', name: '风车斩', cost: 2, type: 'attack', rarity: 'uncommon', char: 'watcher', target: 'enemy',
    fx: [{ t: 'dmg', v: 14, u: 18 }] });
C({ id: 'w_conclude', name: '终结', cost: 1, type: 'attack', rarity: 'common', char: 'watcher', target: 'enemy',
    fx: [{ t: 'dmg', v: 11, u: 14 }] });
C({ id: 'w_halt', name: '停手', cost: 1, type: 'skill', rarity: 'uncommon', char: 'watcher', target: 'self',
    fx: [{ t: 'block', v: 6, u: 9 }, { t: 'blockStance', v: 5, st: 'calm' }] });
C({ id: 'w_talkhand', name: '与手交谈', cost: 1, type: 'attack', rarity: 'uncommon', char: 'watcher', target: 'enemy',
    fx: [{ t: 'dmg', v: 5, u: 8 }, { t: 'block', v: 5, u: 8 }] });
C({ id: 'w_fasting', name: '禁食', cost: 1, type: 'power', rarity: 'rare', char: 'watcher', target: 'self',
    fx: [{ t: 'str', v: 2, u: 3 }, { t: 'dex', v: 2, u: 3 }] });
C({ id: 'w_wallop', name: '回击', cost: 2, type: 'attack', rarity: 'rare', char: 'watcher', target: 'enemy',
    fx: [{ t: 'dmg', v: 10, u: 14 }, { t: 'blockEqualDmg' }] });

/* ============ 索引与导出 ============ */
const CARD_MAP = {};
for (const c of CARDS) CARD_MAP[c.id] = c;
function getCard(id) { return CARD_MAP[id]; }
function cardName(c, up) { return up ? c.name + '+' : c.name; }
function cardCost(c, up) { return c.cost; }
function isUpgradable(c) {
  if (c.rarity === 'special') return false;
  return c.fx.some(f => f.u !== undefined);
}
function fxVal(f, up) { return up && f.u !== undefined ? f.u : f.v; }

module.exports = { CARDS, CARD_MAP, getCard, cardName, cardCost, isUpgradable, fxVal };

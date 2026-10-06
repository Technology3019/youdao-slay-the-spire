<template>
    <div class="battle-root">
        <image class="bg" :src="art.bg_battle" resize="stretch"></image>

        <div class="top-area">
            <!-- 玩家面板 -->
            <div class="player-panel">
                <image class="p-portrait" :src="portrait" resize="contain"></image>
                <div class="p-col">
                    <text class="p-name">{{ run.charName }}</text>
                    <div class="hp-bar">
                        <div class="hp-fill" :style="{ width: hpW + 'px' }"></div>
                        <text class="hp-text">{{ b.player.hp }}/{{ b.player.maxHp }}</text>
                    </div>
                    <div class="badge-row">
                        <div v-if="b.player.block > 0" class="block-badge">
                            <image class="mini" :src="art.ic_shield"></image>
                            <text class="badge-text">{{ b.player.block }}</text>
                        </div>
                        <div class="energy-badge">
                            <text class="energy-text">{{ b.player.energy }}/{{ b.player.maxEnergy }}</text>
                        </div>
                        <image v-if="b.player.stance" class="stance" :src="stanceIcon"></image>
                    </div>
                    <div class="stat-row">
                        <div v-for="s in playerStats" :key="s.k" class="stat">
                            <image class="mini" :src="art[s.icon]"></image>
                            <text class="stat-text">{{ s.v }}</text>
                        </div>
                    </div>
                    <div class="orb-row">
                        <image v-for="(o, i) in b.player.orbs" :key="i" class="orb" :class="{ glow: pulse }" :src="art['orb_' + o.kind]"></image>
                        <image v-for="i in (3 - b.player.orbs.length)" :key="'e' + i" class="orb orb-empty" :src="art.orb_dark"></image>
                    </div>
                </div>
            </div>

            <!-- 敌人（弹性列） -->
            <div class="enemy-area">
                <div v-for="(e, i) in b.enemies" :key="i" class="enemy" :class="{ dead: !e.alive, targeted: selected >= 0 && e.alive }"
                     @click="onEnemy(i)">
                    <div class="intent">
                        <image class="intent-icon" :src="intentIcon(e)"></image>
                        <text class="intent-text">{{ intentText(e) }}</text>
                    </div>
                    <image class="e-art" :src="art[e.def.art]" :style="enemyStyle(e)" resize="contain"></image>
                    <text class="e-name">{{ e.def.name }}</text>
                    <div class="hp-bar e-hp">
                        <div class="hp-fill e-hp-fill" :style="{ width: eHpW(e) + 'px' }"></div>
                        <text class="hp-text e-hp-text">{{ e.hp }}/{{ e.maxHp }}</text>
                    </div>
                    <div class="stat-row">
                        <div v-if="e.block > 0" class="stat">
                            <image class="mini" :src="art.ic_shield"></image>
                            <text class="stat-text">{{ e.block }}</text>
                        </div>
                        <div v-for="s in enemyStats(e)" :key="s.k" class="stat">
                            <image class="mini" :src="art[s.icon]"></image>
                            <text class="stat-text">{{ s.v }}</text>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 中部信息条 -->
        <div class="mid-bar">
            <text class="log-text">{{ lastLog }}</text>
            <div class="mid-right">
                <text class="pile-text">抽{{ b.player.draw.length }} 弃{{ b.player.discard.length }} 耗{{ b.player.exhaust.length }}</text>
                <div class="end-btn" :class="{ pulse: pulse }" @click="$emit('end-turn')">
                    <text class="end-text">结束回合</text>
                </div>
            </div>
        </div>

        <!-- 手牌 -->
        <div class="hand">
            <div v-for="(c, i) in b.player.hand" :key="c.uid" class="card-slot"
                 :class="{ picked: selected === i, unaffordable: !affordable(c) }"
                 @click="onCard(i)">
                <image class="frame" :src="art['frame_' + cardType(c)]" resize="stretch"></image>
                <div class="cost-dot">
                    <text class="cost-text">{{ cardCost(c) }}</text>
                </div>
                <text class="card-name">{{ cardNm(c) }}</text>
                <text class="card-desc">{{ cardDs(c) }}</text>
            </div>
            <div v-if="selected >= 0" class="hint">
                <text class="hint-text">选择目标</text>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import ART from '../assets.js';
import cardsDb from '../game/cards.js';
import bt from '../game/battle.js';

const STATUS_DEF = [
    ['str', '力量', 'ic_str'], ['dex', '敏捷', 'ic_dexterity'], ['vuln', '易伤', 'ic_vuln'],
    ['weak', '虚弱', 'ic_weak'], ['poison', '中毒', 'ic_poison'], ['mantra', '真言', 'ic_mantra'],
];
const INTENT_ICON = { attack: 'intent_attack', attackBuff: 'intent_attack_buff', defend: 'intent_defend', buff: 'intent_buff', debuff: 'intent_debuff' };

export default defineComponent({
    props: { b: { type: Object, required: true }, run: { type: Object, required: true } },
    emits: ['play', 'end-turn'],
    data() {
        return { art: ART, selected: -1, pulse: false };
    },
    mounted() {
        const self = this;
        this._t = setInterval(function () { self.pulse = !self.pulse; }, 600);
    },
    beforeUnmount() { if (this._t) clearInterval(this._t); },
    computed: {
        portrait() { return ART['char_' + this.run.char + '_portrait'] || ART.char_ironclad_portrait; },
        hpW() { return Math.max(0, Math.round(88 * this.b.player.hp / this.b.player.maxHp)); },
        stanceIcon() {
            const m = { anger: 'stance_anger', calm: 'stance_calm', divinity: 'stance_divine' };
            return ART[m[this.b.player.stance]] || ART.stance_calm;
        },
        playerStats() { return this.statsOf(this.b.player, STATUS_DEF); },
        lastLog() { const l = this.b.log; return l.length ? l[l.length - 1] : '战斗开始'; },
    },
    methods: {
        statsOf(who, keys) {
            const out = [];
            for (const [k, name, icon] of keys) {
                const v = who.statuses[k] || 0;
                if (v > 0) out.push({ k: k, name: name, icon: icon, v: v });
            }
            return out;
        },
        enemyStats(e) { return this.statsOf(e, STATUS_DEF.filter(s => s[0] !== 'dex' && s[0] !== 'mantra')); },
        intentIcon(e) {
            const it = bt.intentOf(e);
            return ART[INTENT_ICON[it.t] || 'intent_unknown'];
        },
        intentText(e) {
            const it = bt.intentOf(e);
            if (it.t === 'attack' || it.t === 'attackBuff') {
                let v = it.v + (e.statuses.str || 0);
                if (e.statuses.weak > 0) v = Math.floor(v * 0.75);
                return it.hits && it.hits > 1 ? v + 'x' + it.hits : '' + v;
            }
            if (it.t === 'defend') return '' + it.v;
            if (it.fx && it.fx.str) return '+' + it.fx.str;
            return '';
        },
        enemyStyle(e) {
            const t = e.def.tier;
            if (t === 'boss') return { width: '76px', height: '86px' };
            if (t === 'elite') return { width: '64px', height: '74px' };
            return { width: '58px', height: '66px' };
        },
        eHpW(e) { return Math.max(0, Math.round(72 * e.hp / e.maxHp)); },
        affordable(c) { return this.b.player.energy >= cardsDb.getCard(c.id).cost; },
        cardType(c) { const d = cardsDb.getCard(c.id); return d.type === 'attack' ? 'attack' : d.type === 'skill' ? 'skill' : 'power'; },
        cardCost(c) { return cardsDb.getCard(c.id).cost; },
        cardNm(c) { return cardsDb.cardName(cardsDb.getCard(c.id), c.up); },
        cardDs(c) { return bt.renderDesc(cardsDb.getCard(c.id), c.up); },
        onCard(i) {
            if (this.selected === i) { this.selected = -1; return; }
            if (!this.affordable(this.b.player.hand[i])) return;
            const def = cardsDb.getCard(this.b.player.hand[i].id);
            if (def.target === 'enemy') {
                const alive = this.b.enemies.filter(e => e.alive);
                if (!alive.length) return;
                if (alive.length === 1) {
                    this.$emit('play', { handIdx: i, targetIdx: this.b.enemies.indexOf(alive[0]) });
                    this.selected = -1;
                    return;
                }
                this.selected = i;
            } else {
                this.$emit('play', { handIdx: i, targetIdx: 0 });
                this.selected = -1;
            }
        },
        onEnemy(i) {
            if (this.selected < 0 || !this.b.enemies[i].alive) return;
            this.$emit('play', { handIdx: this.selected, targetIdx: i });
            this.selected = -1;
        },
    },
});
</script>

<style scoped>
.battle-root { width: 100%; height: 100%; }
.bg { position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; }
.top-area { position: absolute; left: 4px; top: 4px; width: 98%; height: 142px; flex-direction: row; }
.player-panel { width: 196px; height: 140px; flex-direction: row; background-color: rgba(10,10,20,0.55); border-radius: 8px; padding: 5px; }
.p-portrait { width: 60px; height: 60px; }
.p-col { flex-direction: column; margin-left: 5px; flex-grow: 1; }
.p-name { font-size: 1.88vw; color: #e8d9a0; font-weight: bold; }
.hp-bar { width: 116px; height: 13px; background-color: #3a1018; border-radius: 6px; margin-top: 3px; }
.hp-fill { height: 13px; background-color: #d84040; border-radius: 6px; }
.hp-text { position: absolute; left: 0px; top: 0px; width: 116px; height: 13px; font-size: 1.41vw; color: #ffffff; text-align: center; line-height: 13px; }
.badge-row { flex-direction: row; margin-top: 3px; align-items: center; }
.block-badge { flex-direction: row; align-items: center; background-color: rgba(30,60,110,0.8); border-radius: 6px; padding-left: 3px; padding-right: 4px; height: 15px; }
.energy-badge { flex-direction: row; align-items: center; background-color: rgba(140,100,20,0.85); border-radius: 6px; padding-left: 4px; padding-right: 4px; height: 15px; margin-left: 4px; }
.badge-text { font-size: 1.41vw; color: #cfe8ff; }
.energy-text { font-size: 1.41vw; color: #ffe9a0; }
.mini { width: 12px; height: 12px; }
.stance { width: 16px; height: 16px; margin-left: 4px; }
.stat-row { flex-direction: row; margin-top: 2px; flex-wrap: wrap; }
.stat { flex-direction: row; align-items: center; margin-right: 4px; }
.stat-text { font-size: 1.25vw; color: #f0e8d8; margin-left: 1px; }
.orb-row { flex-direction: row; margin-top: 3px; }
.orb { width: 20px; height: 20px; margin-right: 3px; }
.orb-empty { opacity: 0.25; }
.enemy-area { flex-grow: 1; height: 140px; flex-direction: row; margin-left: 4px; }
.enemy { flex-grow: 1; height: 140px; flex-direction: column; align-items: center; border-radius: 8px; background-color: rgba(10,10,20,0.35); margin-right: 4px; }
.dead { opacity: 0.25; }
.targeted { border-width: 2px; border-color: #e8b830; }
.intent { flex-direction: row; align-items: center; height: 17px; }
.intent-icon { width: 16px; height: 16px; }
.intent-text { font-size: 1.72vw; color: #ffd8a0; font-weight: bold; margin-left: 2px; }
.e-art { margin-top: 1px; }
.e-name { font-size: 1.25vw; color: #d8d0c0; }
.e-hp { width: 78px; height: 11px; margin-top: 1px; }
.e-hp-fill { height: 11px; }
.e-hp-text { width: 78px; height: 11px; line-height: 11px; font-size: 1.25vw; }
.mid-bar { position: absolute; left: 6px; top: 148px; width: 97%; height: 26px; flex-direction: row; align-items: center; }
.log-text { flex-grow: 1; font-size: 1.56vw; color: #c8c0d8; }
.mid-right { flex-direction: row; align-items: center; }
.pile-text { font-size: 1.41vw; color: #9990b0; margin-right: 6px; }
.pulse { background-color: #b04545; }
.glow { opacity: 0.7; }
.end-btn { width: 84px; height: 24px; background-color: #8a3030; border-radius: 6px; align-items: center; justify-content: center; }
.end-text { font-size: 1.72vw; color: #ffe8d0; font-weight: bold; }
.hand { position: absolute; left: 4px; bottom: 4px; width: 98%; height: 76px; flex-direction: row; align-items: flex-end; flex-wrap: wrap; }
.card-slot { width: 52px; height: 72px; margin-left: 3px; }
.picked { border-width: 2px; border-color: #e8b830; }
.unaffordable { opacity: 0.55; }
.frame { width: 52px; height: 72px; position: absolute; left: 0px; top: 0px; }
.cost-dot { position: absolute; left: 2px; top: 2px; width: 14px; height: 14px; border-radius: 7px; background-color: #f0ead0; align-items: center; justify-content: center; }
.cost-text { font-size: 1.41vw; color: #151320; font-weight: bold; }
.card-name { position: absolute; left: 0px; top: 18px; width: 52px; font-size: 1.41vw; color: #f0e8d8; text-align: center; }
.card-desc { position: absolute; left: 3px; top: 31px; width: 46px; height: 38px; font-size: 1.09vw; color: #b8b0c8; text-align: center; overflow: hidden; }
.hint { position: absolute; right: 6px; bottom: 80px; width: 66px; height: 18px; background-color: rgba(232,184,48,0.9); border-radius: 5px; align-items: center; justify-content: center; }
.hint-text { font-size: 1.56vw; color: #151320; font-weight: bold; }
</style>

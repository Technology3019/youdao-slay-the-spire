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
                        <div class="hp-fill" :style="{ width: hpW }"></div>
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
                        <div class="hp-fill e-hp-fill" :style="{ width: eHpW(e) }"></div>
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
        hpW() { return Math.max(0, Math.round(93.1 * this.b.player.hp / this.b.player.maxHp)) + '%'; },
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
            if (t === 'boss') return { width: '9.500vw', height: '33.858vh' };
            if (t === 'elite') return { width: '8.000vw', height: '29.134vh' };
            return { width: '7.250vw', height: '25.984vh' };
        },
        eHpW(e) { return Math.max(0, Math.round(92.3 * e.hp / e.maxHp)) + '%'; },
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
.bg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.top-area { position: absolute; left: 0.500vw; top: 1.575vh; width: 98%; height: 55.906vh; flex-direction: row; }
.player-panel { width: 24.500vw; height: 55.118vh; flex-direction: row; background-color: rgba(10,10,20,0.55); border-radius: 3.150vh; padding: 1.969vh; }
.p-portrait { width: 7.500vw; height: 7.500vw; }
.p-col { flex-direction: column; margin-left: 0.625vw; flex-grow: 1; }
.p-name { font-size: 1.88vw; color: #e8d9a0; font-weight: bold; }
.hp-bar { width: 14.500vw; height: 5.118vh; background-color: #3a1018; border-radius: 2.362vh; margin-top: 1.181vh; }
.hp-fill { height: 5.118vh; background-color: #d84040; border-radius: 2.362vh; }
.hp-text { position: absolute; left: 0; top: 0; width: 14.500vw; height: 5.118vh; font-size: 1.41vw; color: #ffffff; text-align: center; line-height: 5.118vh; }
.badge-row { flex-direction: row; margin-top: 1.181vh; align-items: center; }
.block-badge { flex-direction: row; align-items: center; background-color: rgba(30,60,110,0.8); border-radius: 2.362vh; padding-left: 0.375vw; padding-right: 0.500vw; height: 5.906vh; }
.energy-badge { flex-direction: row; align-items: center; background-color: rgba(140,100,20,0.85); border-radius: 2.362vh; padding-left: 0.500vw; padding-right: 0.500vw; height: 5.906vh; margin-left: 0.500vw; }
.badge-text { font-size: 1.41vw; color: #cfe8ff; }
.energy-text { font-size: 1.41vw; color: #ffe9a0; }
.mini { width: 1.500vw; height: 1.500vw; }
.stance { width: 2.000vw; height: 2.000vw; margin-left: 0.500vw; }
.stat-row { flex-direction: row; margin-top: 0.787vh; flex-wrap: wrap; }
.stat { flex-direction: row; align-items: center; margin-right: 0.500vw; }
.stat-text { font-size: 1.25vw; color: #f0e8d8; margin-left: 0.125vw; }
.orb-row { flex-direction: row; margin-top: 1.181vh; }
.orb { width: 2.500vw; height: 2.500vw; margin-right: 0.375vw; }
.orb-empty { opacity: 0.25; }
.enemy-area { flex-grow: 1; height: 55.118vh; flex-direction: row; margin-left: 0.500vw; }
.enemy { flex-grow: 1; height: 55.118vh; flex-direction: column; align-items: center; border-radius: 3.150vh; background-color: rgba(10,10,20,0.35); margin-right: 0.500vw; }
.dead { opacity: 0.25; }
.targeted { border-width: 0.787vh; border-color: #e8b830; }
.intent { flex-direction: row; align-items: center; height: 6.693vh; }
.intent-icon { width: 2.000vw; height: 2.000vw; }
.intent-text { font-size: 1.72vw; color: #ffd8a0; font-weight: bold; margin-left: 0.250vw; }
.e-art { margin-top: 0.394vh; }
.e-name { font-size: 1.25vw; color: #d8d0c0; }
.e-hp { width: 9.750vw; height: 4.331vh; margin-top: 0.394vh; }
.e-hp-fill { height: 4.331vh; }
.e-hp-text { width: 9.750vw; height: 4.331vh; line-height: 4.331vh; font-size: 1.25vw; }
.mid-bar { position: absolute; left: 0.750vw; top: 58.268vh; width: 97%; height: 10.236vh; flex-direction: row; align-items: center; }
.log-text { flex-grow: 1; font-size: 1.56vw; color: #c8c0d8; }
.mid-right { flex-direction: row; align-items: center; }
.pile-text { font-size: 1.41vw; color: #9990b0; margin-right: 0.750vw; }
.pulse { background-color: #b04545; }
.glow { opacity: 0.7; }
.end-btn { width: 10.500vw; height: 9.449vh; background-color: #8a3030; border-radius: 2.362vh; align-items: center; justify-content: center; }
.end-text { font-size: 1.72vw; color: #ffe8d0; font-weight: bold; }
.hand { position: absolute; left: 0.500vw; bottom: 1.575vh; width: 98%; height: 29.921vh; flex-direction: row; align-items: flex-end; flex-wrap: wrap; }
.card-slot { width: 6.500vw; height: 28.346vh; margin-left: 0.375vw; }
.picked { border-width: 0.787vh; border-color: #e8b830; }
.unaffordable { opacity: 0.55; }
.frame { width: 6.500vw; height: 28.346vh; position: absolute; left: 0; top: 0; }
.cost-dot { position: absolute; left: 0.250vw; top: 0.787vh; width: 1.750vw; height: 1.750vw; border-radius: 0.875vw; background-color: #f0ead0; align-items: center; justify-content: center; }
.cost-text { font-size: 1.41vw; color: #151320; font-weight: bold; }
.card-name { position: absolute; left: 0; top: 7.087vh; width: 6.500vw; font-size: 1.41vw; color: #f0e8d8; text-align: center; }
.card-desc { position: absolute; left: 0.375vw; top: 12.205vh; width: 5.750vw; height: 14.961vh; font-size: 1.09vw; color: #b8b0c8; text-align: center; overflow: hidden; }
.hint { position: absolute; right: 0.750vw; bottom: 31.496vh; width: 8.250vw; height: 7.087vh; background-color: rgba(232,184,48,0.9); border-radius: 1.969vh; align-items: center; justify-content: center; }
.hint-text { font-size: 1.56vw; color: #151320; font-weight: bold; }
</style>

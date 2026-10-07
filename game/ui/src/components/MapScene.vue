<template>
    <div class="map-root">
        <image class="bg" :src="art.bg_map" resize="stretch"></image>

        <div class="side">
            <image class="portrait" :src="portrait" resize="contain" @click="tapPortrait"></image>
            <text class="side-name">{{ run.charName }}</text>
            <div class="hp-bar">
                <div class="hp-fill" :style="{ width: hpW + 'px' }"></div>
                <text class="hp-text">{{ run.hp }}/{{ run.maxHp }}</text>
            </div>
            <text class="gold-text">金币 {{ run.gold }}</text>
            <text class="act-text">第{{ actCn }}幕 · 第 {{ run.floor }} 层</text>
            <div class="relic-row">
                <image v-for="r in relicList" :key="r.id" class="relic" :src="art[r.art]"></image>
            </div>
            <div class="btn" @click="$emit('deck')">
                <text class="btn-t">牌组 {{ run.deck.length }}</text>
            </div>
            <div class="btn btn-dim" @click="$emit('title')">
                <text class="btn-t">回标题</text>
            </div>
        </div>

        <div class="grid">
            <div v-for="row in run.map.rows" :key="row[0].r" class="col">
                <div v-for="n in row" :key="n.c" class="node-slot">
                    <div class="node" :class="nodeClass(n)" @click="onNode(n)">
                        <image class="node-icon" :src="nodeIcon(n)"></image>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="node-slot boss-slot">
                    <div class="node boss" :class="{ reachable: bossReach }" @click="onBoss">
                        <image class="node-icon" :src="art.ic_card_blood"></image>
                    </div>
                </div>
            </div>
        </div>
        <text class="map-tip">{{ tip }}</text>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import ART from '../assets.js';
import mapGen from '../game/map.js';
import relicsDb from '../game/relics.js';
import state from '../game/state.js';

const TYPE_ICON = {
    battle: 'ic_card_strike', elite: 'ic_str', rest: 'ic_card_heal',
    shop: 'relic_coin', chest: 'relic_crown', event: 'ic_card_eye', boss: 'ic_card_blood',
};
export default defineComponent({
    props: { run: { type: Object, required: true } },
    emits: ['enter', 'deck', 'title', 'cheat'],
    data() { return { art: ART, pulse: false }; },
    mounted() {
        const self = this;
        this.taps = 0;
        this._t = setInterval(function () { self.pulse = !self.pulse; }, 500);
    },
    beforeUnmount() { if (this._t) clearInterval(this._t); },
    computed: {
        portrait() { return ART[state.CHARS[this.run.char].portrait]; },
        hpW() { return Math.max(0, Math.round(96 * this.run.hp / this.run.maxHp)); },
        actCn() { return ['一', '二', '三'][this.run.act - 1] || '一'; },
        relicList() { return this.run.relics.map(id => relicsDb.getRelic(id)).filter(Boolean); },
        bossReach() {
            if (this.run.curRow !== mapGen.ROWS - 1) return false;
            return mapGen.canMove(this.run.map, this.run.curRow, this.run.curCol, mapGen.ROWS, 0);
        },
        tip() {
            if (this.run.curRow === -1) return '点击最左侧一列开始爬塔';
            if (this.bossReach) return 'Boss 战就在前方！';
            return '高亮节点可前进（仅限相邻一层）';
        },
    },
    methods: {
        isReach(n) {
            return mapGen.canMove(this.run.map, this.run.curRow, this.run.curCol, n.r, n.c);
        },
        nodeClass(n) {
            const reachable = this.isReach(n);
            const current = n.r === this.run.curRow && n.c === this.run.curCol;
            const visited = n.r < this.run.curRow;
            const cls = { reachable: reachable, current: current, visited: visited, pulse: reachable && this.pulse };
            cls['t-' + n.type] = true;
            return cls;
        },
        nodeIcon(n) { return this.art[TYPE_ICON[n.type]] || this.art.ic_card_strike; },
        tapPortrait() {
            // 连点人物头像 10 次进入作弊菜单，全程无任何提示
            this.taps++;
            if (this.taps >= 10) {
                this.taps = 0;
                this.$emit('cheat');
            }
        },
        onNode(n) {
            if (!this.isReach(n)) return;
            this.$emit('enter', { r: n.r, c: n.c, type: n.type });
        },
        onBoss() {
            if (this.bossReach) this.$emit('enter', { r: mapGen.ROWS, c: 0, type: 'boss' });
        },
    },
});
</script>

<style scoped>
.map-root { width: 100%; height: 100%; }
.bg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.side { position: absolute; left: 0.750vw; top: 1.575vh; width: 16.500vw; height: 97%; flex-direction: column; align-items: center; background-color: rgba(10,10,20,0.6); border-radius: 3.150vh; padding-top: 1.575vh; }
.portrait { width: 5.750vw; height: 5.750vw; }
.side-name { font-size: 1.88vw; color: #e8d9a0; font-weight: bold; margin-top: 1.181vh; }
.hp-bar { width: 13.250vw; height: 4.724vh; background-color: #3a1018; border-radius: 2.362vh; margin-top: 1.181vh; }
.hp-fill { height: 4.724vh; background-color: #d84040; border-radius: 2.362vh; }
.hp-text { position: absolute; left: 0; top: 0; width: 13.250vw; height: 4.724vh; line-height: 4.724vh; font-size: 1.41vw; color: #fff; text-align: center; }
.gold-text { font-size: 1.56vw; color: #ffd76a; margin-top: 1.181vh; }
.act-text { font-size: 1.56vw; color: #b8b0c8; margin-top: 0.787vh; }
.relic-row { flex-direction: row; flex-wrap: wrap; width: 15.000vw; margin-top: 1.181vh; justify-content: center; overflow: hidden; }
.relic { width: 2.500vw; height: 2.500vw; margin: 0.394vh; }
.btn { width: 13.250vw; height: 8.661vh; background-color: #33334d; border-radius: 2.362vh; align-items: center; justify-content: center; margin-top: 1.969vh; }
.btn-dim { background-color: #26263a; }
.btn-t { font-size: 1.88vw; color: #ccccdd; }
.grid { position: absolute; left: 17.750vw; top: 3.150vh; width: 76%; height: 85.039vh; flex-direction: row; }
.col { flex-grow: 1; width: 5.000vw; height: 85.039vh; flex-direction: column; justify-content: center; }
.node-slot { height: 21.260vh; align-items: center; justify-content: center; }
.boss-slot { height: 85.039vh; justify-content: center; }
.node { width: 4.750vw; height: 4.750vw; border-radius: 2.375vw; background-color: rgba(20,20,34,0.85); border-width: 0.787vh; border-color: #4a4a66; align-items: center; justify-content: center; }
.t-battle { border-color: #6a7fd0; }
.t-elite { border-color: #d05050; }
.t-rest { border-color: #40b060; }
.t-shop { border-color: #d0a040; }
.t-chest { border-color: #c0c050; }
.t-event { border-color: #9060d0; }
.reachable { border-width: 1.181vh; border-color: #ffd76a; background-color: rgba(70,60,20,0.9); }
.pulse { background-color: rgba(120,95,25,0.95); }
.current { background-color: rgba(40,90,50,0.9); border-color: #7dffa0; }
.visited { opacity: 0.35; }
.boss { width: 5.750vw; height: 5.750vw; border-radius: 2.875vw; border-color: #ff5050; background-color: rgba(50,16,20,0.9); }

.node-icon { width: 2.750vw; height: 2.750vw; }

.map-tip { position: absolute; left: 17.750vw; bottom: 1.575vh; width: 76%; font-size: 1.56vw; color: #c8c0d8; text-align: center; }
.reachable { border-width: 1.181vh; border-color: #ffd76a; background-color: rgba(70,60,20,0.9); }
.pulse { background-color: rgba(120,95,25,0.95); }
</style>

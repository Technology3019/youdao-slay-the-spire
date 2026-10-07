<template>
    <div class="deck-root">
        <image class="bg" :src="art.bg_map" resize="stretch"></image>
        <div class="bar">
            <text class="bar-t">{{ title }}</text>
            <text class="hint-t" v-if="mode === 'view'">点击卡牌查看详情 · 上下滑动查看更多</text>
            <div class="back" @click="$emit('back')">
                <text class="back-t">返回</text>
            </div>
        </div>
        <scroll class="grid" scroll-y="true">
            <div class="grid-inner">
                <div v-for="(c, i) in run.deck" :key="i" class="cell" @click="onPick(i)">
                    <image class="frame" :src="frameOf(c)" resize="stretch"></image>
                    <text class="up-mark" v-if="c.up">+</text>
                    <text class="cname">{{ nameOf(c) }}</text>
                </div>
            </div>
        </scroll>
        <div class="mask" v-if="detail" @click="detail = null">
            <image class="d-bg" :src="art.bg_map" resize="stretch"></image>
            <div class="d-wrap">
                <image class="d-frame" :src="detail.frame" resize="stretch"></image>
                <text class="d-name">{{ detail.name }}</text>
                <text class="d-cost">费用 {{ detail.cost }} · {{ detail.typeName }}<text v-if="detail.up"> · 已强化</text></text>
                <text class="d-target" v-if="detail.target">{{ detail.target }}</text>
                <text class="d-desc">{{ detail.desc }}</text>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue';
import ART from '../assets.js';
import cardsDb from '../game/cards.js';
import bt from '../game/battle.js';
const TYPE_CN = { attack: '攻击', skill: '技能', power: '能力' };
export default defineComponent({
    props: {
        run: { type: Object, required: true },
        mode: { type: String, default: 'view' },
    },
    emits: ['back', 'choose'],
    data() { return { art: ART, detail: null }; },
    computed: {
        title() {
            if (this.mode === 'upgrade') return '选择要升级的卡牌';
            if (this.mode === 'remove') return '选择要移除的卡牌';
            return '牌组（' + this.run.deck.length + ' 张）';
        },
    },
    methods: {
        frameOf(c) { const t = cardsDb.getCard(c.id).type; return this.art['frame_' + (t === 'attack' ? 'attack' : t === 'skill' ? 'skill' : 'power')]; },
        nameOf(c) { return cardsDb.cardName(cardsDb.getCard(c.id), c.up); },
        onPick(i) {
            // 查看模式：点击任意卡牌弹出详情
            if (this.mode === 'view') {
                const inst = this.run.deck[i];
                const def = cardsDb.getCard(inst.id);
                this.detail = {
                    frame: this.frameOf(inst),
                    name: this.nameOf(inst),
                    cost: def.cost,
                    typeName: TYPE_CN[def.type] || def.type,
                    target: def.target || '',
                    desc: bt.renderDesc(def, inst.up),
                    up: !!inst.up,
                };
                return;
            }
            if (this.mode === 'upgrade') {
                const c = this.run.deck[i];
                if (c.up || !cardsDb.isUpgradable(cardsDb.getCard(c.id))) return;
            }
            this.$emit('choose', i);
        },
    },
});
</script>
<style scoped>
.deck-root { width: 100%; height: 100%; }
.bg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; opacity: 0.6; }
.bar { position: absolute; left: 1.000vw; top: 2.362vh; width: 98%; height: 10.236vh; flex-direction: row; align-items: center; }
.bar-t { flex-grow: 1; font-size: 2.03vw; color: #e8d9a0; font-weight: bold; }
.hint-t { font-size: 1.41vw; color: #8899aa; margin-right: 1.500vw; }
.back { width: 11.250vw; height: 9.449vh; background-color: #33334d; border-radius: 2.362vh; align-items: center; justify-content: center; }
.back-t { font-size: 1.88vw; color: #ccccdd; }
.grid { position: absolute; left: 2%; top: 14.961vh; width: 96%; height: 82.677vh; }
.grid-inner { flex-direction: row; flex-wrap: wrap; padding-bottom: 2vh; }
.cell { width: 7.500vw; height: 32.283vh; margin: 1.181vh; }
.frame { width: 7.500vw; height: 32.283vh; position: absolute; left: 0; top: 0; }
.up-mark { position: absolute; right: 0.375vw; top: 0; font-size: 2.19vw; color: #7dffb0; font-weight: bold; }
.cname { position: absolute; left: 0; top: 10.236vh; width: 7.500vw; font-size: 1.41vw; color: #f0e8d8; text-align: center; }
.mask { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.d-wrap { position: absolute; left: 33.500%; top: 3.150vh; width: 33.000%; height: 93.700vh; align-items: center; justify-content: center; }
.d-frame { position: absolute; left: 0; top: 0; width: 33.000%; height: 93.700vh; }
.d-name { font-size: 2.34vw; color: #f0e8d8; font-weight: bold; margin-top: 3vh; width: 92%; text-align: center; }
.d-cost { font-size: 1.56vw; color: #ffd76a; margin-top: 1vh; width: 92%; text-align: center; }
.d-target { font-size: 1.41vw; color: #9fc4e0; margin-top: 1vh; width: 92%; text-align: center; }
.d-desc { font-size: 1.63vw; color: #e8e0f4; margin-top: 1.5vh; width: 92%; text-align: center; }
.d-tip { font-size: 1.31vw; color: #8899aa; margin-top: 2vh; width: 92%; text-align: center; }





.d-bg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
</style>

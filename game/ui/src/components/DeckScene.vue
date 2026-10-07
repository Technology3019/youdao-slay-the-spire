<template>
    <div class="deck-root">
        <image class="bg" :src="art.bg_map" resize="stretch"></image>
        <div class="bar">
            <text class="bar-t">{{ title }}</text>
            <div class="back" @click="$emit('back')">
                <text class="back-t">返回</text>
            </div>
        </div>
        <div class="grid">
            <div v-for="(c, i) in run.deck" :key="i" class="cell" @click="onPick(i)">
                <image class="frame" :src="frameOf(c)" resize="stretch"></image>
                <text class="up-mark" v-if="c.up">+</text>
                <text class="cname">{{ nameOf(c) }}</text>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue';
import ART from '../assets.js';
import cardsDb from '../game/cards.js';
export default defineComponent({
    props: {
        run: { type: Object, required: true },
        mode: { type: String, default: 'view' },
    },
    emits: ['back', 'choose'],
    data() { return { art: ART }; },
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
            if (this.mode === 'view') return;
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
.back { width: 11.250vw; height: 9.449vh; background-color: #33334d; border-radius: 2.362vh; align-items: center; justify-content: center; }
.back-t { font-size: 1.88vw; color: #ccccdd; }
.grid { position: absolute; left: 2%; top: 14.961vh; width: 96%; height: 82.677vh; flex-direction: row; flex-wrap: wrap; }
.cell { width: 7.500vw; height: 32.283vh; margin: 1.181vh; }
.frame { width: 7.500vw; height: 32.283vh; position: absolute; left: 0; top: 0; }
.up-mark { position: absolute; right: 0.375vw; top: 0; font-size: 2.19vw; color: #7dffb0; font-weight: bold; }
.cname { position: absolute; left: 0; top: 10.236vh; width: 7.500vw; font-size: 1.41vw; color: #f0e8d8; text-align: center; }
</style>

<template>
    <div class="reward-root">
        <image class="bg" :src="art.bg_win" resize="stretch"></image>
        <div class="panel">
            <text class="title">战斗胜利</text>
            <text class="gold">获得 {{ reward.gold }} 金币</text>
            <text class="sub">选择一张卡牌加入牌组</text>
            <div class="cards">
                <div v-for="id in reward.cards" :key="id" class="slot" @click="pick(id)">
                    <image class="frame" :src="frameOf(id)" resize="stretch"></image>
                    <div class="cost-dot">
                        <text class="cost-t">{{ costOf(id) }}</text>
                    </div>
                    <text class="cname">{{ nameOf(id) }}</text>
                    <text class="cdesc">{{ descOf(id) }}</text>
                </div>
            </div>
            <div class="skip" @click="pick(null)">
                <text class="skip-t">跳过</text>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import ART from '../assets.js';
import cardsDb from '../game/cards.js';
import bt from '../game/battle.js';

export default defineComponent({
    props: { reward: { type: Object, required: true } },
    emits: ['done'],
    data() { return { art: ART }; },
    methods: {
        pick(id) { this.$emit('done', id); },
        def(id) { return cardsDb.getCard(id); },
        frameOf(id) { const t = this.def(id).type; return this.art['frame_' + (t === 'attack' ? 'attack' : t === 'skill' ? 'skill' : 'power')]; },
        costOf(id) { return this.def(id).cost; },
        nameOf(id) { return this.def(id).name; },
        descOf(id) { return bt.renderDesc(this.def(id), false); },
    },
});
</script>

<style scoped>
.reward-root { width: 100%; height: 100%; }
.bg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.panel { position: absolute; left: 22%; top: 2.362vh; width: 56%; height: 95%; flex-direction: column; align-items: center; background-color: rgba(12,12,22,0.85); border-radius: 3.937vh; }
.title { font-size: 2.66vw; color: #e8d9a0; font-weight: bold; margin-top: 2.362vh; }
.gold { font-size: 2.03vw; color: #ffd76a; margin-top: 2.362vh; }
.sub { font-size: 1.72vw; color: #b8b0c8; margin-top: 1.575vh; }
.cards { flex-direction: row; margin-top: 3.937vh; }
.slot { width: 9.250vw; height: 40.945vh; margin: 0 0.875vw; }
.frame { width: 9.250vw; height: 40.945vh; position: absolute; left: 0; top: 0; }
.cost-dot { position: absolute; left: 0.375vw; top: 1.181vh; width: 2.125vw; height: 2.125vw; border-radius: 1.125vw; background-color: #f0ead0; align-items: center; justify-content: center; }
.cost-t { font-size: 1.72vw; color: #151320; font-weight: bold; }
.cname { position: absolute; left: 0; top: 9.055vh; width: 11.000vw; font-size: 1.88vw; color: #f0e8d8; text-align: center; }
.cdesc { position: absolute; left: 0.875vw; top: 17.323vh; width: 9.250vw; height: 27.559vh; font-size: 1.41vw; color: #c8c0d8; text-align: center; overflow: hidden; }
.skip { width: 11.250vw; height: 9.449vh; background-color: #33334d; border-radius: 2.362vh; align-items: center; justify-content: center; margin-top: 2.756vh; }
.skip-t { font-size: 1.88vw; color: #ccccdd; }
</style>

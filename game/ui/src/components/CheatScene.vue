<template>
    <div class="cheat-root">
        <image class="bg" :src="art.bg_shop" resize="stretch"></image>
        <div class="bar">
            <text class="bar-t">作弊菜单 · {{ run.charName }} · 生命 {{ run.hp }}/{{ run.maxHp }} · 金币 {{ run.gold }}</text>
            <div class="leave" @click="$emit('back')">
                <text class="leave-t">返回</text>
            </div>
        </div>
        <div class="row">
            <div class="slot" @click="addHp">
                <image class="frame" :src="art.ic_card_heal" resize="stretch"></image>
                <text class="cname">加 10 点生命值</text>
                <text class="cdesc">立刻回复 10 点生命，不会超过上限</text>
            </div>
            <div class="slot" @click="addGold">
                <image class="frame" :src="art.relic_coin" resize="stretch"></image>
                <text class="cname">加 20 点金币</text>
                <text class="cdesc">立刻获得 20 金币</text>
            </div>
            <div class="slot" @click="$emit('shop')">
                <image class="frame" :src="art.frame_colorless" resize="stretch"></image>
                <text class="cname">作弊商店</text>
                <text class="cdesc">与普通商店相同：可买卡、卖遗物、删牌</text>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import ART from '../assets.js';
export default defineComponent({
    props: { run: { type: Object, required: true } },
    emits: ['back', 'shop'],
    data() { return { art: ART }; },
    methods: {
        addHp() {
            this.run.hp = Math.min(this.run.maxHp, this.run.hp + 10);
            this.$emit('back');
        },
        addGold() {
            this.run.gold = this.run.gold + 20;
            this.$emit('back');
        },
    },
});
</script>

<style scoped>
.cheat-root { width: 100%; height: 100%; }
.bg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.bar { position: absolute; left: 1.000vw; top: 2.362vh; width: 98%; height: 10.236vh; flex-direction: row; align-items: center; }
.bar-t { flex-grow: 1; font-size: 2.03vw; color: #ffd76a; font-weight: bold; }
.leave { width: 11.250vw; height: 9.449vh; background-color: #33334d; border-radius: 2.362vh; align-items: center; justify-content: center; }
.leave-t { font-size: 1.88vw; color: #ccccdd; }
.row { position: absolute; left: 6%; top: 17.323vh; width: 88%; height: 78.740vh; flex-direction: row; justify-content: center; }
.slot { width: 18.000vw; height: 48.819vh; margin: 0 1.250vw; }
.frame { width: 11.000vw; height: 11.000vw; }
.cname { font-size: 1.88vw; color: #f0e8d8; text-align: center; margin-top: 3.937vh; }
.cdesc { font-size: 1.41vw; color: #c8c0d8; text-align: center; margin-top: 3.937vh; }
</style>

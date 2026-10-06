<template>
    <div class="save-root">
        <image class="bg" :src="art.bg_title" resize="stretch"></image>
        <text class="big-title" :class="{ pulse: pulse }">杀戮尖塔</text>
        <div class="slots">
            <div v-for="(s, i) in slots" :key="i" class="slot-col"><div class="slot" @click="onSlot(i)">
                <text class="slot-no">存档 {{ i + 1 }}</text>
                <template v-if="s.run">
                    <text class="slot-char">{{ s.run.charName }}</text>
                    <text class="slot-line">第{{ actCn(s.run) }}幕 · 第 {{ s.run.floor }} 层</text>
                    <div class="mini-hp">
                        <div class="mini-fill" :style="{ width: hpW(s.run) + 'px' }"></div>
                    </div>
                    <text class="slot-line">生命 {{ s.run.hp }}/{{ s.run.maxHp }} · 金币 {{ s.run.gold }}</text>
                    <text class="slot-line">牌组 {{ s.run.deck.length }} 张</text>
                </template>
                <template v-else>
                    <text class="slot-empty">空存档</text>
                    <text class="slot-line">点击创建新冒险</text>
                </template>
            </div>
                <div class="del" v-if="s.run" @click="del(i)">
                    <text class="del-t">删除存档</text>
                </div>
            </div>
        <text class="pkg-name">杀戮尖塔 v{{ version }}</text>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import pkg from '../../package.json';
import ART from '../assets.js';
export default defineComponent({
    props: { slots: { type: Array, required: true } },
    emits: ['slot', 'del'],
    data() { return { art: ART, version: pkg.version, pulse: false }; },
    mounted() {
        const self = this;
        this._t = setInterval(function () { self.pulse = !self.pulse; }, 700);
    },
    beforeUnmount() { if (this._t) clearInterval(this._t); },
    methods: {
        onSlot(i) { this.$emit('slot', i); },
        del(i) { this.$emit('del', i); },
        actCn(run) { return ['一', '二', '三'][(run.act || 1) - 1] || '一'; },
        hpW(run) { return Math.round(72 * (run.hp || 0) / (run.maxHp || 1)); },
    },
});
</script>

<style scoped>
.save-root { width: 100%; height: 100%; flex-direction: column; align-items: center; }
.bg { position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; }
.big-title { font-size: 4.69vw; color: #e8d9a0; font-weight: bold; margin-top: 14px; }
.sub-title { font-size: 1.88vw; color: #9999bb; margin-top: 4px; margin-bottom: 10px; }
.pulse { color: #fff2c0; }
.pkg-name { position: absolute; left: 0px; bottom: 4px; width: 100%; font-size: 1.56vw; color: #7777a0; text-align: center; }
.slots { flex-direction: row; justify-content: center; }
.slot-col { flex-direction: column; align-items: center; }
.slot { flex-grow: 1; width: 150px; height: 158px; margin: 0px 9px; background-color: rgba(20,20,34,0.88); border-radius: 10px; flex-direction: column; align-items: center; padding-top: 10px; }
.slot-no { font-size: 2.03vw; color: #8888aa; }
.slot-char { font-size: 2.97vw; color: #f0e8d8; font-weight: bold; margin-top: 7px; }
.slot-empty { font-size: 2.66vw; color: #666688; margin-top: 22px; }
.slot-line { font-size: 1.56vw; color: #b8b0c8; margin-top: 5px; }
.mini-hp { width: 76px; height: 10px; background-color: #3a1018; border-radius: 5px; margin-top: 7px; }
.mini-fill { height: 10px; background-color: #d84040; border-radius: 5px; }
.del { width: 120px; height: 30px; background-color: #5a2a36; border-radius: 6px; align-items: center; justify-content: center; margin-top: 8px; }
.del-t { font-size: 1.88vw; color: #f0b0b0; }
</style>

<template>
    <div class="rest-root">
        <image class="bg" :src="art.bg_rest" resize="stretch"></image>
        <div class="panel">
            <text class="title">篝火休息</text>
            <text class="sub">当前生命 {{ run.hp }}/{{ run.maxHp }}</text>
            <div class="opt" @click="heal">
                <text class="opt-t">休息（回复 {{ healAmt }} 点生命）</text>
            </div>
            <div class="opt" @click="$emit('upgrade')">
                <text class="opt-t">打磨（升级一张卡牌）</text>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue';
import ART from '../assets.js';
export default defineComponent({
    props: { run: { type: Object, required: true } },
    emits: ['heal', 'upgrade'],
    data() { return { art: ART }; },
    computed: { healAmt() { return Math.floor(this.run.maxHp * 0.3); } },
    methods: { heal() { this.$emit('heal'); } },
});
</script>
<style scoped>
.rest-root { width: 100%; height: 100%; }
.bg { position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; }
.panel { position: absolute; left: 30%; top: 40px; width: 40%; height: 174px; flex-direction: column; align-items: center; background-color: rgba(12,12,22,0.85); border-radius: 10px; }
.title { font-size: 3.13vw; color: #e8d9a0; font-weight: bold; margin-top: 14px; }
.sub { font-size: 1.88vw; color: #b8b0c8; margin-top: 8px; }
.opt { width: 230px; height: 36px; background-color: #33334d; border-radius: 8px; align-items: center; justify-content: center; margin-top: 14px; }
.opt-t { font-size: 2.03vw; color: #ccccdd; }
</style>

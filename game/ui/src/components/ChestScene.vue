<template>
    <div class="chest-root">
        <image class="bg" :src="art.bg_chest" resize="stretch"></image>
        <div class="panel">
            <text class="title">宝箱</text>
            <text v-if="!opened" class="sub">一只落满灰尘的箱子……</text>
            <text v-else class="sub">{{ result }}</text>
            <div class="opt" @click="open" v-if="!opened">
                <text class="opt-t">打开</text>
            </div>
            <div class="opt" @click="$emit('done')" v-if="opened">
                <text class="opt-t">继续</text>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue';
import ART from '../assets.js';
import relicsDb from '../game/relics.js';
export default defineComponent({
    props: { run: { type: Object, required: true } },
    emits: ['done'],
    data() { return { art: ART, opened: false, result: '' }; },
    methods: {
        open() {
            this.opened = true;
            const r = relicsDb.randomRelics(1, this.run.relics, Math.random);
            if (r.length) { this.run.relics.push(r[0].id); this.result = '获得遗物【' + r[0].name + '】：' + r[0].desc; }
            else { this.run.gold += 60; this.result = '箱子里是 60 金币！'; }
        },
    },
});
</script>
<style scoped>
.chest-root { width: 100%; height: 100%; }
.bg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.panel { position: absolute; left: 30%; top: 19.685vh; width: 40%; height: 59.055vh; flex-direction: column; align-items: center; background-color: rgba(12,12,22,0.85); border-radius: 3.937vh; }
.title { font-size: 3.13vw; color: #e8d9a0; font-weight: bold; margin-top: 4.724vh; }
.sub { font-size: 1.88vw; color: #c8c0d8; margin-top: 3.150vh; width: 31.250vw; text-align: center; }
.opt { width: 16.250vw; height: 12.598vh; background-color: #6a5420; border-radius: 3.150vh; align-items: center; justify-content: center; margin-top: 3.937vh; }
.opt-t { font-size: 2.03vw; color: #ffe9a0; }
</style>

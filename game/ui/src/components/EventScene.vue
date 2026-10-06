<template>
    <div class="event-root">
        <image class="bg" :src="art.bg_event" resize="stretch"></image>
        <div class="panel">
            <text class="title">{{ ev.title }}</text>
            <text class="body">{{ ev.text }}</text>
            <text v-if="result" class="result">{{ result }}</text>
            <div v-for="(ch, i) in ev.choices" :key="i" class="opt" @click="choose(ch)" v-if="!result">
                <text class="opt-t">{{ ch.label }}</text>
            </div>
            <div class="opt opt-leave" @click="$emit('done')" v-if="result">
                <text class="opt-t">继续</text>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue';
import ART from '../assets.js';
import eventsDb from '../game/events.js';
export default defineComponent({
    props: { run: { type: Object, required: true } },
    emits: ['done'],
    data() { return { art: ART, ev: eventsDb.pickEvent(), result: '' }; },
    methods: {
        choose(ch) {
            if (this.result) return;
            this.result = ch.fx(this.run);
        },
    },
});
</script>
<style scoped>
.event-root { width: 100%; height: 100%; }
.bg { position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; }
.panel { position: absolute; left: 22%; top: 12px; width: 56%; height: 92%; flex-direction: column; align-items: center; background-color: rgba(14,10,24,0.88); border-radius: 10px; }
.title { font-size: 2.97vw; color: #d8b8ff; font-weight: bold; margin-top: 10px; }
.body { font-size: 1.72vw; color: #c8c0d8; margin-top: 6px; width: 90%; text-align: center; }
.result { font-size: 1.88vw; color: #7dffb0; margin-top: 5px; width: 90%; text-align: center; }
.opt { width: 78%; height: 28px; background-color: #2e2a44; border-radius: 7px; align-items: center; justify-content: center; margin-top: 6px; }
.opt-leave { background-color: #3d5a3d; }
.opt-t { font-size: 1.88vw; color: #ccccdd; }
</style>

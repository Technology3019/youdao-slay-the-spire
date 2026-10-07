<template>
    <div class="title-wrap">
        <div class="char-btn" :class="{ pulse: pulse }" @click="start('ironclad')">
            <image class="portrait" :src="portraits.ironclad" resize="contain"></image>
            <text class="char-name">铁甲战士</text>
            <text class="char-desc">力量·易伤·自伤</text>
            <text class="char-desc">燃烧之血</text>
        </div>
        <div class="char-btn" :class="{ pulse: pulse }" @click="start('silent')">
            <image class="portrait" :src="portraits.silent" resize="contain"></image>
            <text class="char-name">静默猎手</text>
            <text class="char-desc">中毒·弃牌·飞刀</text>
            <text class="char-desc">蛇之戒指</text>
        </div>
        <div class="char-btn" :class="{ pulse: pulse }" @click="start('defect')">
            <image class="portrait" :src="portraits.defect" resize="contain"></image>
            <text class="char-name">故障机器人</text>
            <text class="char-desc">充能球·集中</text>
            <text class="char-desc">破损核心</text>
        </div>
        <div class="char-btn" :class="{ pulse: pulse }" @click="start('watcher')">
            <image class="portrait" :src="portraits.watcher" resize="contain"></image>
            <text class="char-name">观者</text>
            <text class="char-desc">姿态·真言</text>
            <text class="char-desc">纯净之水</text>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import pIronclad from './src/assets/img/char_ironclad_portrait.png';
import pSilent from './src/assets/img/char_silent_portrait.png';
import pDefect from './src/assets/img/char_defect_portrait.png';
import pWatcher from './src/assets/img/char_watcher_portrait.png';

export default defineComponent({
    emits: ['start', 'load'],
    data() {
        this.pulse = false;
        return {
            portraits: {
                ironclad: pIronclad,
                silent: pSilent,
                defect: pDefect,
                watcher: pWatcher,
            },
        };
    },
    mounted() {
        const self = this;
        this._t = setInterval(function () { self.pulse = !self.pulse; }, 700);
    },
    beforeUnmount() { if (this._t) clearInterval(this._t); },
    methods: {
        start(id) {
            this.$emit('start', id);
        },
    },
});
</script>

<style scoped>
.title-wrap {
    width: 100.000vw;
    height: 100.000vh;
    flex-direction: row;
    align-items: center;
}
.brand {
    width: 18.500vw;
    margin-left: 3.000vw;
    flex-direction: column;
    align-items: center;
}
.title-text {
    font-size: 6.25vw;
    color: #e8d9a0;
    font-weight: bold;
}
.sub-text {
    font-size: 2.03vw;
    color: #8888aa;
    margin-top: 5.512vh;
}
.pulse { background-color: #2e2e48; }
.char-btn {
    flex-grow: 1;
    width: 12.000vw;
    height: 82.677vh;
    margin-left: 1.500vw;
    padding-top: 3.937vh;
    border-radius: 3.150vh;
    background-color: #232333;
    align-items: center;
}
.portrait {
    width: 7.750vw;
    height: 7.750vw;
}
.char-name {
    font-size: 2.66vw;
    color: #f0f0f0;
    font-weight: bold;
    margin-top: 3.150vh;
}
.char-desc {
    font-size: 1.72vw;
    color: #9999bb;
    margin-top: 1.969vh;
}
</style>

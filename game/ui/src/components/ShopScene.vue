<template>
    <div class="shop-root">
        <image class="bg" :src="art.bg_shop" resize="stretch"></image>
        <div class="bar">
            <text class="bar-t">商店 · 金币 {{ run.gold }}</text>
            <div class="leave" @click="$emit('leave')">
                <text class="leave-t">离开</text>
            </div>
        </div>
        <div class="row">
            <div v-for="(s, i) in stock.cards" :key="i" class="slot" @click="buyCard(s)">
                <image class="frame" :src="frameOf(s.id)" resize="stretch"></image>
                <text class="cname">{{ nameOf(s.id) }}</text>
                <text class="cdesc">{{ descOf(s.id) }}</text>
                <div class="price" :class="{ cant: run.gold < s.price || s.sold }">
                    <text class="price-t">{{ s.sold ? '已售' : s.price + '金' }}</text>
                </div>
            </div>
            <div class="slot" @click="buyRelic">
                <image class="frame" :src="art[relicArt]" resize="stretch"></image>
                <text class="cname">{{ relicName }}</text>
                <text class="cdesc">{{ relicDesc }}</text>
                <div class="price" :class="{ cant: run.gold < 90 || relicSold }">
                    <text class="price-t">{{ relicSold ? '已售' : '90金' }}</text>
                </div>
            </div>
            <div class="slot" @click="$emit('remove')">
                <image class="frame" :src="art.frame_colorless" resize="stretch"></image>
                <text class="cname">删牌服务</text>
                <text class="cdesc">从牌组中移除一张牌</text>
                <div class="price" :class="{ cant: run.gold < 75 || removeUsed }">
                    <text class="price-t">{{ removeUsed ? '已用' : '75金' }}</text>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue';
import ART from '../assets.js';
import cardsDb from '../game/cards.js';
import relicsDb from '../game/relics.js';
import bt from '../game/battle.js';
function priceOf(c) { return c.rarity === 'rare' ? 75 : c.rarity === 'uncommon' ? 60 : 45; }
export default defineComponent({
    props: { run: { type: Object, required: true } },
    emits: ['leave', 'remove'],
    data() {
        const pool = cardsDb.CARDS.filter(c => c.char === this.run.char && c.rarity !== 'basic' && c.rarity !== 'special');
        const picks = [];
        const cp = pool.slice();
        for (let i = 0; i < 3 && cp.length; i++) picks.push(cp.splice(Math.floor(Math.random() * cp.length), 1)[0]);
        const rel = relicsDb.randomRelics(1, this.run.relics, Math.random);
        return {
            art: ART,
            stock: { cards: picks.map(c => ({ id: c.id, price: priceOf(c), sold: false })) },
            relic: rel.length ? rel[0] : null,
            relicSold: false,
            removeUsed: false,
        };
    },
    computed: {
        relicArt() { return this.relic ? this.relic.art : 'relic_coin'; },
        relicName() { return this.relic ? this.relic.name : '售罄'; },
        relicDesc() { return this.relic ? this.relic.desc : ''; },
    },
    methods: {
        frameOf(id) { const t = cardsDb.getCard(id).type; return this.art['frame_' + (t === 'attack' ? 'attack' : t === 'skill' ? 'skill' : 'power')]; },
        nameOf(id) { return cardsDb.getCard(id).name; },
        descOf(id) { return bt.renderDesc(cardsDb.getCard(id), false); },
        buyCard(s) {
            if (s.sold || this.run.gold < s.price) return;
            this.run.gold -= s.price;
            this.run.deck.push({ id: s.id, up: false });
            s.sold = true;
        },
        buyRelic() {
            if (!this.relic || this.relicSold || this.run.gold < 90) return;
            this.run.gold -= 90;
            this.run.relics.push(this.relic.id);
            this.relicSold = true;
        },
    },
});
</script>
<style scoped>
.shop-root { width: 100%; height: 100%; }
.bg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.bar { position: absolute; left: 1.000vw; top: 2.362vh; width: 98%; height: 10.236vh; flex-direction: row; align-items: center; }
.bar-t { flex-grow: 1; font-size: 2.03vw; color: #ffd76a; font-weight: bold; }
.leave { width: 11.250vw; height: 9.449vh; background-color: #33334d; border-radius: 2.362vh; align-items: center; justify-content: center; }
.leave-t { font-size: 1.88vw; color: #ccccdd; }
.row { position: absolute; left: 6%; top: 17.323vh; width: 88%; height: 78.740vh; flex-direction: row; justify-content: center; }
.slot { width: 11.000vw; height: 48.819vh; margin: 0 1.250vw; }
.frame { width: 11.000vw; height: 48.819vh; position: absolute; left: 0; top: 0; }
.cname { position: absolute; left: 0; top: 9.449vh; width: 11.000vw; font-size: 1.88vw; color: #f0e8d8; text-align: center; }
.cdesc { position: absolute; left: 0.875vw; top: 17.323vh; width: 9.250vw; height: 22.047vh; font-size: 1.41vw; color: #c8c0d8; text-align: center; overflow: hidden; }
.price { position: absolute; left: 1.750vw; bottom: 0.787vh; width: 7.500vw; height: 7.087vh; background-color: #6a5420; border-radius: 1.969vh; align-items: center; justify-content: center; }
.cant { background-color: #403040; opacity: 0.7; }
.price-t { font-size: 1.56vw; color: #ffe9a0; }
</style>

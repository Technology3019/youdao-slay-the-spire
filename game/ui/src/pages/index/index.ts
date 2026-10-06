import { defineComponent } from 'vue';
import SaveScene from '@/components/SaveScene.vue';
import TitleScene from '@/components/TitleScene.vue';
import MapScene from '@/components/MapScene.vue';
import BattleScene from '@/components/BattleScene.vue';
import RewardScene from '@/components/RewardScene.vue';
import RestScene from '@/components/RestScene.vue';
import ShopScene from '@/components/ShopScene.vue';
import ChestScene from '@/components/ChestScene.vue';
import EventScene from '@/components/EventScene.vue';
import DeckScene from '@/components/DeckScene.vue';
import StubScene from '@/components/StubScene.vue';
import state from '../../game/state.js';
import mapGen from '../../game/map.js';
import save from '../../game/save.js';
import bt from '../../game/battle.js';
import cardsDb from '../../game/cards.js';
import enemiesDb from '../../game/enemies.js';
import relicsDb from '../../game/relics.js';

function pickEnemies(act, tier, rnd) {
    const pool = enemiesDb.poolBy(act, tier);
    if (pool.length === 0) return ['jaw_worm'];
    if (tier === 'boss' || tier === 'elite') return [pool[Math.floor(rnd() * pool.length)].id];
    const n = rnd() < 0.55 ? 2 : (rnd() < 0.75 ? 3 : 1);
    const out = [];
    const copy = pool.slice();
    for (let i = 0; i < n && copy.length; i++) out.push(copy.splice(Math.floor(rnd() * copy.length), 1)[0].id);
    return out;
}
function rewardPool(charId) {
    return cardsDb.CARDS.filter(c => c.char === charId && c.rarity !== 'basic' && c.rarity !== 'special');
}

const index = defineComponent({
    components: { SaveScene, TitleScene, MapScene, BattleScene, RewardScene, RestScene, ShopScene, ChestScene, EventScene, DeckScene, StubScene },
    data() {
        return {
            scene: 'slots',
            slots: [{ run: null }, { run: null }, { run: null }],
            slot: -1,
            run: null as any,
            battle: null as any,
            reward: null as any,
            stubName: '',
            overText: '',
            deckMode: 'view',
            deckReturn: 'map',
        };
    },
    mounted() {
        this.refreshSlots();
    },
    methods: {
        /* ---- 存档页 ---- */
        async refreshSlots() {
            const list = [];
            for (let i = 0; i < 3; i++) list.push({ run: await save.loadSlot(i) });
            this.slots = list;
        },
        async onSlot(i) {
            this.slot = i;
            const s = this.slots[i];
            if (s.run && s.run.deck && s.run.deck.length) {
                const run = s.run;
                if (!run.map) run.map = mapGen.genMap(run.act);
                if (run.slot === undefined) run.slot = i;
                this.run = run;
                this.scene = run.won ? 'slots' : 'map';
                return;
            }
            this.scene = 'pick';
        },
        async onDelSlot(i) {
            await save.clearSlot(i);
            this.slots[i] = { run: null };
            this.slots = this.slots.slice();
        },
        /* ---- 选角页 ---- */
        async onStart(charId) {
            const run = state.createRun(charId);
            run.slot = this.slot;
            if (!run.map) run.map = mapGen.genMap(run.act);
            this.run = run;
            await save.saveSlot(this.slot, run);
            this.slots[this.slot] = { run: run };
            this.scene = 'map';
        },
        onPickBack() { this.scene = 'slots'; },
        /* ---- 地图 ---- */
        onEnterNode(info) {
            const run = this.run;
            run.curRow = info.r; run.curCol = info.c; run.floor = info.r + 1;
            const t = info.type;
            if (t === 'battle' || t === 'elite' || t === 'boss') {
                const tier = t === 'boss' ? 'boss' : (t === 'elite' ? 'elite' : 'normal');
                this.battle = bt.startCombat(run, pickEnemies(run.act, tier, Math.random));
                this.scene = 'battle';
            } else if (t === 'rest') this.scene = 'rest';
            else if (t === 'shop') this.scene = 'shop';
            else if (t === 'chest') this.scene = 'chest';
            else if (t === 'event') this.scene = 'event';
            save.saveSlot(run.slot, run);
        },
        onShowDeck() { this.deckMode = 'view'; this.deckReturn = 'map'; this.scene = 'deck'; },
        onDeckBack() { this.scene = this.deckReturn; },
        onDeckChoose(i) {
            const run = this.run;
            if (this.deckMode === 'upgrade') {
                const c = run.deck[i];
                if (c && !c.up && cardsDb.isUpgradable(cardsDb.getCard(c.id))) {
                    c.up = true;
                    save.saveSlot(run.slot, run);
                    this.scene = 'map';
                    return;
                }
                return;
            }
            if (this.deckMode === 'remove') {
                if (run.deck.length > 4) {
                    run.deck.splice(i, 1);
                    run.gold -= 75;
                    save.saveSlot(run.slot, run);
                }
                this.scene = 'shop';
                return;
            }
            this.scene = this.deckReturn;
        },
        backToMap() { this.scene = 'map'; },
        /* ---- 战斗 ---- */
        onPlay(p) {
            if (!this.battle) return;
            bt.playCard(this.battle, p.handIdx, p.targetIdx);
            this.afterBattleAction();
        },
        onEndTurn() {
            if (!this.battle) return;
            bt.endTurn(this.battle);
            this.afterBattleAction();
        },
        afterBattleAction() {
            const b = this.battle;
            if (!b || !b.over) return;
            const run = this.run;
            run.hp = Math.max(0, b.player.hp);
            if (b.over === 'lose') {
                this.overText = '你倒下了……';
                this.scene = 'gameover';
                save.clearSlot(run.slot);
                this.slots[run.slot] = { run: null };
                this.slots = this.slots.slice();
                return;
            }
            const node = mapGen.nodeAt(run.map, run.curRow, run.curCol);
            const tier = node.type === 'boss' ? 'boss' : (node.type === 'elite' ? 'elite' : 'normal');
            const gold = tier === 'boss' ? 60 : tier === 'elite' ? 30 : (10 + Math.floor(Math.random() * 11));
            run.gold += gold;
            for (const id of run.relics) {
                const r = relicsDb.getRelic(id);
                if (r && r.hook && r.hook.onVictory) r.hook.onVictory(run);
            }
            for (const id of run.relics) {
                const r = relicsDb.getRelic(id);
                if (r && r.hook && r.hook.onCombatEnd) r.hook.onCombatEnd(b);
            }
            run.hp = Math.max(0, Math.min(run.maxHp, b.player.hp));
            if (node.type === 'boss') {
                if (run.act >= 3) {
                    run.won = true;
                    this.overText = '恭喜通关！尖塔之主已倒下。';
                    this.scene = 'gameover';
                    save.saveSlot(run.slot, run);
                    return;
                }
                run.act += 1; run.floor = 0; run.curRow = -1; run.curCol = -1;
                run.map = mapGen.genMap(run.act);
            }
            const pool = rewardPool(run.char);
            const picks = [];
            const cp = pool.slice();
            for (let i = 0; i < 3 && cp.length; i++) picks.push(cp.splice(Math.floor(Math.random() * cp.length), 1)[0].id);
            this.reward = { gold: gold, cards: picks };
            this.scene = 'reward';
            save.saveSlot(run.slot, run);
        },
        async onRewardDone(cardId) {
            if (cardId) this.run.deck.push({ id: cardId, up: false });
            this.battle = null;
            this.reward = null;
            this.scene = 'map';
            await save.saveSlot(this.run.slot, this.run);
        },
        /* ---- 休息 ---- */
        async onRestHeal() {
            this.run.hp = Math.min(this.run.maxHp, this.run.hp + Math.floor(this.run.maxHp * 0.3));
            this.scene = 'map';
            await save.saveSlot(this.run.slot, this.run);
        },
        onRestUpgrade() { this.deckMode = 'upgrade'; this.deckReturn = 'rest'; this.scene = 'deck'; },
        /* ---- 商店 ---- */
        async onShopLeave() { this.scene = 'map'; await save.saveSlot(this.run.slot, this.run); },
        onShopRemove() {
            if (this.run.gold < 75) return;
            this.deckMode = 'remove'; this.deckReturn = 'shop'; this.scene = 'deck';
        },
        /* ---- 宝箱 / 事件 ---- */
        async onSimpleDone() { this.scene = 'map'; await save.saveSlot(this.run.slot, this.run); },
        toSlots() { this.scene = 'slots'; this.run = null; this.battle = null; this.refreshSlots(); },
        showStub(name) { this.stubName = name; this.scene = 'stub'; },
    },
});

export default index;

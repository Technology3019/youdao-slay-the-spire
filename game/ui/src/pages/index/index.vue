<template>
    <div class="screen">
        <SaveScene v-if="scene === 'slots'" :slots="slots" @slot="onSlot" @del="onDelSlot" />
        <TitleScene v-else-if="scene === 'pick'" @start="onStart" />
        <MapScene v-else-if="scene === 'map' && run" :run="run" @enter="onEnterNode" @deck="onShowDeck" @title="toSlots" />
        <BattleScene v-else-if="scene === 'battle' && battle" :b="battle" :run="run" @play="onPlay" @end-turn="onEndTurn" />
        <RewardScene v-else-if="scene === 'reward' && reward" :reward="reward" @done="onRewardDone" />
        <RestScene v-else-if="scene === 'rest' && run" :run="run" @heal="onRestHeal" @upgrade="onRestUpgrade" />
        <ShopScene v-else-if="scene === 'shop' && run" :run="run" @leave="onShopLeave" @remove="onShopRemove" />
        <ChestScene v-else-if="scene === 'chest' && run" :run="run" @done="onSimpleDone" />
        <EventScene v-else-if="scene === 'event' && run" :run="run" @done="onSimpleDone" />
        <DeckScene v-else-if="scene === 'deck' && run" :run="run" :mode="deckMode" @back="onDeckBack" @choose="onDeckChoose" />
        <div v-else-if="scene === 'gameover'" class="over-wrap">
            <text class="over-text">{{ overText }}</text>
            <div class="over-btn" @click="toSlots">
                <text class="over-btn-t">返回存档页</text>
            </div>
        </div>
        <StubScene v-else :name="stubName" @back="backToMap" />
    </div>
</template>

<style lang="less" scoped>
@import url('index.less');
.over-wrap { width: 100%; height: 100%; flex-direction: column; align-items: center; justify-content: center; }
.over-text { font-size: 20px; color: #e8d9a0; font-weight: bold; margin-bottom: 18px; }
.over-btn { width: 140px; height: 34px; background-color: #33334d; border-radius: 8px; align-items: center; justify-content: center; }
.over-btn-t { font-size: 13px; color: #ccccdd; }
</style>

<script>
import index from './index';
export default index;
</script>

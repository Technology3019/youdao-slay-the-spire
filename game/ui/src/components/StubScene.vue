<template>
    <div class="stub-wrap">
        <text class="stub-text">{{ name }}</text>
        <div class="back-btn" @click="back">
            <text class="back-text">返回</text>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
    props: { name: { type: String, required: true } },
    emits: ['back'],
    methods: {
        back() {
            this.$emit('back');
        },
    },
});
</script>

<style scoped>
.stub-wrap {
    width: 800px;
    height: 254px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.stub-text {
    font-size: 4.06vw;
    color: #e8d9a0;
    font-weight: bold;
}
.back-btn {
    width: 120px;
    padding-top: 8px;
    padding-bottom: 8px;
    margin-top: 18px;
    border-radius: 6px;
    background-color: #33334d;
    align-items: center;
}
.back-text {
    font-size: 2.19vw;
    color: #ccccdd;
}
</style>

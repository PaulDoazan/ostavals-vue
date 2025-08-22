<script setup lang="ts">
import { ref } from 'vue';
import IconBack from './Icon/Back.vue';
import IconHome from './Icon/Home.vue';
import IconLang from './Icon/Lang.vue';
import LangPanel from './LangPanel.vue';

const showLangPanel = ref(true);

</script>

<template>
    <div class="absolute bottom-0 left-20">
        <div
            :class="`flex justify-between items-center bg-redgrey rounded-tl-[50px] ${!showLangPanel && 'rounded-tr-[50px]'}`">
            <IconBack style="margin: 36px;" />
            <IconHome style="margin: 36px;" />
            <IconLang @click="showLangPanel = !showLangPanel" style="margin: 36px;" />
            <LangPanel v-if="showLangPanel" />
        </div>
    </div>
</template>

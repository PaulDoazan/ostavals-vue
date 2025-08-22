<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import IconBack from '../Icon/Back.vue';
import IconHome from '../Icon/Home.vue';
import IconLang from '../Icon/Lang.vue';
import LangPanel from './LangPanel.vue';
import { useLanguage } from '../../composables/useLanguage';

const showLangPanel = ref(true);
const menuRef = ref<HTMLElement | null>(null);
const { initializeLanguage } = useLanguage();

const closeLangPanel = () => {
    showLangPanel.value = false;
}

const handleClickOutside = (event: Event) => {
    if (showLangPanel.value) {
        const target = event.target as HTMLElement;

        // Don't close if clicking on the language button itself
        if (target.closest('.icon-lang') || target.closest('[data-icon="lang"]')) {
            return;
        }

        // Check if the click target is part of the LangPanel
        let isInsideLangPanel = false;
        let currentElement: HTMLElement | null = target;

        // Traverse up the DOM tree to see if we're inside the LangPanel
        while (currentElement && currentElement !== document.body) {
            // Check if this element has the lang-panel class
            if (currentElement.classList.contains('lang-panel')) {
                isInsideLangPanel = true;
                break;
            }
            currentElement = currentElement.parentElement;
        }

        // If click is outside LangPanel, close it
        if (!isInsideLangPanel) {
            closeLangPanel();
        }
    }
}

onMounted(() => {
    initializeLanguage();
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div ref="menuRef" class="absolute bottom-0 left-20">
        <div
            :class="`flex justify-between items-center bg-redgrey rounded-tl-[50px] ${!showLangPanel && 'rounded-tr-[50px]'}`">
            <IconBack style="margin: 36px;" />
            <IconHome style="margin: 36px;" />
            <IconLang @click="showLangPanel = !showLangPanel" style="margin: 36px;" />
            <LangPanel v-if="showLangPanel" @closeLangPanel="closeLangPanel" />
        </div>
    </div>
</template>

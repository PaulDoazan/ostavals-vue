<script setup lang="ts">
import { useTextSize } from '../composables/useTextSize'
import { ref } from 'vue'

const { setTextSize } = useTextSize()
const currentTheme = ref('light')
const languageMenu = ref<HTMLElement>()
const settingsMenu = ref<HTMLElement>()

const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'gray' : 'light'
}

const toggleLanguageMenu = () => {
    if (languageMenu.value) {
        languageMenu.value.classList.toggle('hidden')
    }
}

const toggleSettingsMenu = () => {
    if (settingsMenu.value) {
        settingsMenu.value.classList.toggle('hidden')
    }
}
</script>

<template>
    <div class="layout">
        <nav class="bottom-menu">
            <ul class="flex gap-4 items-center">
                <li>
                    <button
                        class="w-12 h-12 bg-white hover:bg-gray-100 rounded-lg shadow-md flex items-center justify-center transition-colors">
                        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7">
                            </path>
                        </svg>
                    </button>
                </li>
                <li>
                    <button
                        class="w-12 h-12 bg-white hover:bg-gray-100 rounded-lg shadow-md flex items-center justify-center transition-colors">
                        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                            </path>
                        </svg>
                    </button>
                </li>
                <li class="relative">
                    <button @click="toggleLanguageMenu"
                        class="w-12 h-12 bg-white hover:bg-gray-100 rounded-lg shadow-md flex items-center justify-center transition-colors">
                        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129">
                            </path>
                        </svg>
                    </button>
                    <div ref="languageMenu"
                        class="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg p-2 hidden min-w-32">
                        <div class="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <div class="w-6 h-6 bg-blue-500 rounded mr-2"></div>
                            <span class="text-sm">Français</span>
                        </div>
                        <div class="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <div class="w-6 h-6 bg-red-500 rounded mr-2"></div>
                            <span class="text-sm">Euskara</span>
                        </div>
                    </div>
                </li>
                <li class="relative">
                    <button @click="toggleSettingsMenu"
                        class="w-12 h-12 bg-white hover:bg-gray-100 rounded-lg shadow-md flex items-center justify-center transition-colors">
                        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                    </button>
                    <div ref="settingsMenu"
                        class="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg p-2 hidden min-w-48">
                        <div @click="setTextSize('small')"
                            class="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <svg class="w-6 h-6 text-gray-700 mr-2" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h7"></path>
                            </svg>
                            <span class="text-sm">Small</span>
                        </div>
                        <div @click="setTextSize('medium')"
                            class="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <svg class="w-6 h-6 text-gray-700 mr-2" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h7"></path>
                            </svg>
                            <span class="text-sm">Medium</span>
                        </div>
                        <div @click="setTextSize('large')"
                            class="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <svg class="w-6 h-6 text-gray-700 mr-2" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h7"></path>
                            </svg>
                            <span class="text-sm">Large</span>
                        </div>
                        <div class="border-t border-gray-200 my-1"></div>
                        <div @click="toggleTheme"
                            class="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <svg class="w-6 h-6 text-gray-700 mr-2" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01">
                                </path>
                            </svg>
                            <span class="text-sm">{{ currentTheme === 'light' ? 'Switch to Gray' : 'Switch to Light'
                            }}</span>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style scoped>
.layout {
    position: relative;
}

.bottom-menu {
    position: fixed;
    bottom: 0px;
    left: 20px;
    background-color: #D2BEB0;
    padding: 1rem;
    border-radius: 10px 10px 0 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bottom-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.bottom-menu li:last-child {
    margin-bottom: 0;
}

.bottom-menu a {
    text-decoration: none;
    color: #333;
    font-size: 1rem;
    transition: color 0.2s ease;
}

.bottom-menu a:hover {
    color: #666;
}
</style>

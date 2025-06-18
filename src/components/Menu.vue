<script setup lang="ts">
import { useTextSize } from '../composables/useTextSize'
import { useTheme } from 'vuetify'

const { setTextSize } = useTextSize()
const theme = useTheme()

const toggleTheme = () => {
    const currentTheme = theme.global.name.value
    theme.global.name.value = currentTheme === 'light' ? 'gray' : 'light'
}
</script>

<template>
    <div class="layout">
        <nav class="bottom-menu">
            <ul class="d-flex ga-4 align-center">
                <li>
                    <VBtn icon="mdi-arrow-left" size="large" />
                </li>
                <li>
                    <VBtn icon="mdi-home" size="large" />
                </li>
                <li>
                    <VMenu>
                        <template v-slot:activator="{ props }">
                            <VBtn icon="mdi-translate" size="large" v-bind="props" />
                        </template>
                        <VList>
                            <VListItem>
                                <VBtn icon="mdi-flag" size="large" class="mr-2" />
                                <span>Français</span>
                            </VListItem>
                            <VListItem>
                                <VBtn icon="mdi-flag" size="large" class="mr-2" />
                                <span>Euskara</span>
                            </VListItem>
                        </VList>
                    </VMenu>
                </li>
                <li>
                    <VMenu>
                        <template v-slot:activator="{ props }">
                            <VBtn icon="mdi-human" size="large" v-bind="props" />
                        </template>
                        <VList>
                            <VListItem @click="setTextSize('small')">
                                <VBtn icon="mdi-format-size" size="large" class="mr-2" />
                                <span>Small</span>
                            </VListItem>
                            <VListItem @click="setTextSize('medium')">
                                <VBtn icon="mdi-format-size" size="large" class="mr-2" />
                                <span>Medium</span>
                            </VListItem>
                            <VListItem @click="setTextSize('large')">
                                <VBtn icon="mdi-format-size" size="large" class="mr-2" />
                                <span>Large</span>
                            </VListItem>
                            <VDivider />
                            <VListItem @click="toggleTheme">
                                <VBtn icon="mdi-palette" size="large" class="mr-2" />
                                <span>{{ theme.global.name.value === 'light' ? 'Switch to Gray' : 'Switch to Light'
                                }}</span>
                            </VListItem>
                        </VList>
                    </VMenu>
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
    background-color: rgb(var(--v-theme-menu-background));
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

/* Add styles for Vuetify button icons */
:deep(.v-btn) {
    font-size: var(--text-size-base);
}

:deep(.v-btn .v-icon) {
    font-size: inherit;
}
</style>

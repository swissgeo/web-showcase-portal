<script lang="ts" setup>
import GeocatalogButton from '@/components/GeocatalogButton.vue'
import LanguageSwitchButton from '@/components/LanguageSwitchButton.vue'
import LayerCart from '@/components/LayerCart.vue'
import LayerCartButton from '@/components/LayerCartButton.vue'
import LogoPic from '@/components/LogoPic.vue'
import TopicTreeBrowser from '@/components/search/TopicTreeBrowser.vue'
import { useTopicTree } from '@/composables/useTopicTree'
import { useMainStore } from '@/store/main'
import { useMapStore } from '@/store/map'
import { useSearchStore } from '@/store/search'
import { useUiStore } from '@/store/ui'

const { topicTreeRoot, updateGeocatalogLanguage } = useTopicTree()

const uiStore = useUiStore()
const mapStore = useMapStore()
const mainStore = useMainStore()
const searchStore = useSearchStore()

function resetApp() {
    uiStore.$reset()
    searchStore.$reset()
    mainStore.$reset()
    mapStore.$reset()
}

updateGeocatalogLanguage()
</script>

<template>
    <div class="absolute top-0 left-0 z-10 flex h-screen w-auto flex-col bg-neutral-100 shadow-lg">
        <div
            class="flex-shrink-0 cursor-pointer bg-white"
            @click="resetApp"
        >
            <LogoPic
                class="h-12"
                :condensed="!uiStore.isSidebarOpen"
            />
        </div>
        <div class="flex min-h-0 w-full flex-1 flex-row p-0">
            <!-- First column -->
            <div
                class="flex h-full min-w-16 flex-col items-center justify-between bg-neutral-100 pt-4"
            >
                <div class="flex flex-col items-center gap-2">
                    <LayerCartButton />
                    <GeocatalogButton />
                </div>
                <LanguageSwitchButton class="w-19 py-5" />
            </div>
            <!-- Second column -->
            <LayerCart
                v-show="uiStore.isLayerCartVisible"
                class="h-full w-[400px] overflow-y-auto bg-white"
            />
            <TopicTreeBrowser
                v-if="uiStore.isGeocatalogTreeVisible"
                :root="topicTreeRoot"
                class="h-full w-[400px] overflow-y-auto bg-white"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import { computed, inject, onMounted, ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { SEARCH_DEBOUNCE_DELAY } from '@/search'
import useAddressSearch from '@/search/address'
import useGeocat from '@/search/geocat'
import { useMainStore } from '@/store/main'
import { useSearchStore } from '@/store/search'
import { debounce } from '@/utils/debounce'

const keywords = [
    'Solar',
    'Mobility',
    'Climate',
    'Energy',
    'Water',
    'Waste',
    'Biodiversity',
    'Air Quality',
    'Noise',
]

const isDesktop = inject<Ref<boolean>>('isDesktop')

const emits = defineEmits(['focus', 'blur'])

const { t } = useI18n()
const searchStore = useSearchStore()
const geocatSearch = useGeocat()
const mainStore = useMainStore()
const addressSearch = useAddressSearch()
const isSearching = computed(() => !!searchStore.searchTerm)
const scrollContainer = ref<HTMLElement | null>(null)
const language = computed(() => mainStore.language)

const triggerSearch = debounce((value: string) => {
    geocatSearch.searchGeocat(value)
    addressSearch.searchAddress(value, '2056', language.value, 20)
}, SEARCH_DEBOUNCE_DELAY)

const searchTerm = computed({
    get() {
        return searchStore.searchTerm
    },
    set(value: string | null) {
        searchStore.resetSearch()
        if (value === '') {
            // if we don't do this, and the user deletes the chars in the input, then the input
            // will be '' and the search is triggered with an empty string
            value = null
            geocatSearch.cancelSearch()
            return
        }

        searchStore.setSearchTerm(value)

        if (value) {
            triggerSearch(value)
        }
    },
})

const visibleKeywords = computed(() => {
    const term = searchTerm.value?.trim().toLowerCase()
    if (!term) {
        return keywords
    }

    return keywords.filter((value) =>
        t(`keywords.categories.${value.toLowerCase()}`, value).toLowerCase().includes(term)
    )
})

const onFocus = () => {
    emits('focus')
}

const onBlur = () => {
    emits('blur')
}

const clearSearch = () => {
    searchStore.$reset()
}

function handleWheel(event: WheelEvent): void {
    if (event.deltaY === 0) {
        return
    }
    event.preventDefault()
    scrollContainer!.value!.scrollLeft += event.deltaY
}

onMounted(() => {
    scrollContainer.value!.addEventListener('wheel', handleWheel, { passive: false })
})

function onClickKeyword(topic: string) {
    searchTerm.value = t(`keywords.categories.${topic.toLowerCase()}`, topic)
    searchStore.setIsOpenSearch(true)
}
</script>

<template>
    <div>
        <!-- Desktop version -->
        <Card
            v-if="isDesktop"
            class="mt-4 w-[680px]"
        >
            <template #content>
                <IconField>
                    <InputIcon class="pi pi-search"></InputIcon>
                    <InputText
                        id="search"
                        v-model="searchTerm"
                        data-cy="input-search"
                        class="w-full border-none shadow-none"
                        @focus="onFocus"
                        @blur="onBlur"
                    ></InputText>
                    <InputIcon
                        v-if="isSearching"
                        class="pi pi-times cursor-pointer"
                        @click="clearSearch"
                    />
                </IconField>
                <div class="flex items-center gap-2 pt-4">
                    <span
                        v-if="isDesktop && !isSearching"
                        class="text-sm font-medium text-nowrap text-gray-600"
                    >
                        {{ t('keywords.title') }}:
                    </span>
                    <div
                        ref="scrollContainer"
                        class="no-scrollbar w-full grow-0 gap-2 overflow-x-auto bg-white whitespace-nowrap"
                    >
                        <Tag
                            v-for="topic in visibleKeywords"
                            :key="topic"
                            :pt="{
                                root: {
                                    class: 'mr-2 cursor-pointer rounded-lg !border !border-gray-300 !bg-white !text-black',
                                },
                            }"
                            severity="secondary"
                            :value="t(`keywords.categories.${topic.toLowerCase()}`, topic)"
                            @click="onClickKeyword(topic)"
                        ></Tag>
                    </div>
                </div>
            </template>
        </Card>
        <!-- Mobile version -->
        <template v-else>
            <div class="rounded-t-2xl border-t-2 border-neutral-200 bg-white px-4 pt-4 pb-2">
                <IconField>
                    <InputIcon class="pi pi-search"></InputIcon>
                    <InputText
                        id="search"
                        v-model="searchTerm"
                        data-cy="input-search"
                        class="w-full border-none shadow-none"
                        @focus="onFocus"
                        @blur="onBlur"
                    ></InputText>
                    <InputIcon
                        v-if="isSearching"
                        class="pi pi-times cursor-pointer"
                        @click="clearSearch"
                    />
                </IconField>
                <div class="flex items-center gap-2">
                    <span
                        v-if="!isSearching"
                        class="text-sm font-medium text-nowrap text-gray-600"
                    >
                        {{ t('keywords.title') }}:
                    </span>
                    <div
                        ref="scrollContainer"
                        class="no-scrollbar w-full grow-0 gap-2 overflow-x-auto bg-white py-2 whitespace-nowrap"
                    >
                        <Tag
                            v-for="topic in visibleKeywords"
                            :key="topic"
                            :pt="{
                                root: {
                                    class: 'mr-2 cursor-pointer rounded-lg !border !border-gray-300 !bg-white !text-black',
                                },
                            }"
                            severity="secondary"
                            :value="t(`keywords.categories.${topic.toLowerCase()}`, topic)"
                            @click="onClickKeyword(topic)"
                        ></Tag>
                    </div>
                </div>
            </div>
        </template>
        <!-- on desktop, we need the search results positioned here as a child
         of the input, hence the slot
         -->
        <slot></slot>
    </div>
</template>
<style>
.no-scrollbar {
    scrollbar-width: none;
}
</style>

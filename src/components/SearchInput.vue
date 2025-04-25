<script setup lang="ts">
import IconField from 'primevue/iconfield'
import IftaLabel from 'primevue/iftalabel'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSearchStore } from '@/store/search'
import { type GeonetworkRecord } from '@/types/gnRecord.d'
import { debounce } from '@/utils/debounce'

// @ts-expect-error The property exists on the window
// TODO find a better way via types to handle this
const GNUI = window.GNUI

const emits = defineEmits(['focus', 'blur'])

const { t } = useI18n()
const searchStore = useSearchStore()

const isSearching = computed(() => !!searchStore.searchTerm)

const searchTerm = computed({
    get() {
        return searchStore.searchTerm
    },
    set(value: string) {
        searchStore.setSearchTerm(value)
        doSearch(value)
    },
})

const onFocus = () => {
    emits('focus')
}

const onBlur = () => {
    emits('blur')
}

onMounted(() => {
    GNUI.init('https://www.geocat.ch/geonetwork/srv/api')
})

const doSearch = debounce((value: string) => {
    GNUI.recordsRepository
        .search({
            filters: {
                any: value,
                linkProtocol: '/OGC:WMT?S.*/',
            },
            offset: 0,
            limit: 10,
            sort: ['desc', '_score'],
            fields: ['resourceTitleObject', 'link', 'uuid', 'organization', ''],
        })
        .subscribe(({ records }: { records: GeonetworkRecord[] }) => {
            // eslint-disable-next-line no-console
            console.log(records)
            searchStore.setSearchResults(records)
        })
}, 200)

const clearSearch = () => {
    searchStore.clear()
}
</script>

<template>
    <div class="p-4 rounded-t-lg">
        <IconField>
            <IftaLabel>
                <InputIcon
                    class="pi"
                    :class="{ 'pi-search': !isSearching, 'pi-times cursor-pointer': isSearching }"
                    @click="clearSearch"
                ></InputIcon>
                <InputText
                    id="search"
                    v-model="searchTerm"
                    class="w-full"
                    @focus="onFocus"
                    @blur="onBlur"
                ></InputText>
                <label for="search">{{ t('searchPlaceholder') }}</label>
            </IftaLabel>
        </IconField>
        <!-- on desktop, we need the search results positioned here as a child
         of the input, hence the slot
         -->
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import Badge from 'primevue/badge'
import { useI18n } from 'vue-i18n'

import AddressResultList from '@/components/search/AddressResultList.vue'
import GeocatResultList from '@/components/search/GeocatResultList.vue'
import SearchSpinner from '@/components/search/SearchSpinner.vue'
import useSearchResults from '@/components/search/useSearchResults'

const { t } = useI18n()

const {
    showGeocatSpinner,
    showAddressSpinner,
    addressSearchResultCount,
    geocatSearchResultCount,
    isSearching,
} = useSearchResults()
</script>

<template>
    <div class="flex w-full">
        <div class="flex min-w-0 flex-1">
            <div class="relative flex h-full min-h-full w-full flex-col">
                <div
                    v-if="isSearching"
                    class="flex items-center gap-2 font-bold"
                >
                    {{ t('searchResult.dataTitle') }}
                    <Badge :value="geocatSearchResultCount"></Badge>
                </div>
                <SearchSpinner v-if="showGeocatSpinner" />

                <GeocatResultList class="overflow-auto" />
            </div>
        </div>

        <div class="flex-shrink-0 border-l border-neutral-100"></div>

        <div class="flex min-w-0 flex-1">
            <div class="relative flex h-full w-full flex-col overflow-hidden">
                <div
                    v-if="isSearching"
                    class="flex items-center gap-2 font-bold"
                >
                    {{ t('searchResult.addressTitle') }}
                    <Badge :value="addressSearchResultCount"></Badge>
                </div>
                <SearchSpinner v-if="showAddressSpinner" />
                <AddressResultList
                    v-else
                    class="overflow-x-hidden overflow-y-auto text-ellipsis"
                />
            </div>
        </div>
    </div>
</template>

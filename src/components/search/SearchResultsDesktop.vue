<script lang="ts" setup>
import Badge from 'primevue/badge'
import ProgressSpinner from 'primevue/progressspinner'
import { useI18n } from 'vue-i18n'

import AddressResultList from '@/components/search/AddressResultList.vue'
import GeocatResultList from '@/components/search/GeocatResultList.vue'
import useSearchResults from '@/components/search/useSearchResults'

const { t } = useI18n()

const {
    showSpinner,
    showAddressSpinner,
    addressSearchResultCount,
    geocatSearchResultCount,
    isSearching,
} = useSearchResults()
</script>

<template>
    <div class="flex">
        <div class="flex h-full w-1/2 flex-col">
            <div
                v-if="isSearching"
                class="flex items-center gap-2 font-bold"
            >
                {{ t('searchResult.dataTitle') }}
                <Badge :value="geocatSearchResultCount"></Badge>
            </div>
            <div
                v-if="showSpinner"
                class="flex h-full items-center justify-center"
            >
                <ProgressSpinner />
            </div>
            <GeocatResultList
                v-else
                class="overflow-auto"
            />
        </div>

        <div class="border-l border-neutral-100"></div>

        <div class="flex h-full w-1/2 flex-col">
            <div
                v-if="isSearching"
                class="flex items-center gap-2 font-bold"
            >
                {{ t('searchResult.addressTitle') }}
                <Badge :value="addressSearchResultCount"></Badge>
            </div>
            <div
                v-if="showAddressSpinner"
                class="flex h-full items-center justify-center"
            >
                <ProgressSpinner />
            </div>
            <AddressResultList
                v-else
                class="overflow-auto"
            />
        </div>
    </div>
</template>

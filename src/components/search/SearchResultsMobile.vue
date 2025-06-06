<script lang="ts" setup>
import Accordion from 'primevue/accordion'
import AccordionContent from 'primevue/accordioncontent'
import AccordionHeader from 'primevue/accordionheader'
import AccordionPanel from 'primevue/accordionpanel'
import Badge from 'primevue/badge'
import { ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import AddressResultList from '@/components/search/AddressResultList.vue'
import GeocatResultList from '@/components/search/GeocatResultList.vue'
import SearchSpinner from '@/components/search/SearchSpinner.vue'
import useSearchResults from '@/components/search/useSearchResults'

// which accordion panel is open
const openAccordionPanel: Ref<string | null> = ref(null)

const {
    showGeocatSpinner,
    showAddressSpinner,
    addressSearchResultCount,
    geocatSearchResultCount,
    isSearching,
} = useSearchResults()

const { t } = useI18n()

function onUpdateAccordion(value: string | string[] | null | undefined) {
    if (Array.isArray(value)) {
        throw new Error('Multiple open accordions not supported')
    }
    openAccordionPanel.value = value || null
}
</script>

<template>
    <Accordion
        v-if="isSearching"
        class="flex flex-col overflow-hidden"
        @update:value="onUpdateAccordion"
    >
        <AccordionPanel
            v-if="geocatSearchResultCount || showGeocatSpinner"
            value="data"
            class="overflow-hidden"
            data-cy="comp-data-accordion"
            :class="{ 'h-full': openAccordionPanel === 'data' }"
        >
            <AccordionHeader class="!relative">
                <SearchSpinner
                    v-if="showGeocatSpinner"
                    :size="'40px'"
                />
                <div class="flex items-center justify-start gap-2">
                    {{ t('searchResult.dataTitle') }}
                    <Badge :value="showGeocatSpinner ? 0 : geocatSearchResultCount"></Badge>
                </div>
            </AccordionHeader>
            <AccordionContent
                class="overflow-hidden"
                data-cy="comp-data-accordion-content"
            >
                <GeocatResultList class="" />
            </AccordionContent>
        </AccordionPanel>

        <AccordionPanel
            v-if="addressSearchResultCount || showAddressSpinner"
            data-cy="comp-address-accordion"
            class="overflow-hidden"
            value="address"
            :class="{ 'h-fit': openAccordionPanel === 'address' }"
        >
            <AccordionHeader class="!relative">
                <SearchSpinner
                    v-if="showAddressSpinner"
                    :size="'40px'"
                />
                <div class="flex items-center justify-start gap-2">
                    {{ t('searchResult.placesTitle') }}
                    <Badge :value="showAddressSpinner ? 0 : addressSearchResultCount"></Badge>
                </div>
            </AccordionHeader>
            <AccordionContent class="overflow-y-scroll"> <AddressResultList /> </AccordionContent
        ></AccordionPanel>
    </Accordion>
</template>

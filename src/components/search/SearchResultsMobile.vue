<script lang="ts" setup>
import Accordion from 'primevue/accordion'
import AccordionContent from 'primevue/accordioncontent'
import AccordionHeader from 'primevue/accordionheader'
import AccordionPanel from 'primevue/accordionpanel'
import Badge from 'primevue/badge'
import ProgressSpinner from 'primevue/progressspinner'
import { ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import AddressResultList from '@/components/search/AddressResultList.vue'
import GeocatResultList from '@/components/search/GeocatResultList.vue'
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
    <div
        v-if="showGeocatSpinner && showAddressSpinner"
        class="flex h-full items-center justify-center"
    >
        <ProgressSpinner />
    </div>
    <Accordion
        v-else-if="isSearching"
        class="flex h-full flex-col overflow-hidden"
        @update:value="onUpdateAccordion"
    >
        <AccordionPanel
            v-if="geocatSearchResultCount"
            value="data"
            class="overflow-hidden"
            data-cy="comp-data-accordion"
            :class="{ 'h-full': openAccordionPanel === 'data' }"
        >
            <AccordionHeader>
                <div class="flex items-center justify-start gap-2">
                    {{ t('searchResult.dataTitle') }}
                    <Badge :value="geocatSearchResultCount"></Badge>
                </div>
            </AccordionHeader>
            <AccordionContent
                class="overflow-y-scroll"
                data-cy="comp-data-accordion-content"
                :class="{ 'h-full': openAccordionPanel === 'data' }"
            >
                <GeocatResultList />
            </AccordionContent>
        </AccordionPanel>

        <AccordionPanel
            v-if="addressSearchResultCount"
            data-cy="comp-address-accordion"
            class="overflow-hidden"
            value="address"
            :class="{ 'h-full': openAccordionPanel === 'address' }"
        >
            <AccordionHeader>
                <div class="flex items-center justify-start gap-2">
                    {{ t('searchResult.addressTitle') }}
                    <Badge :value="addressSearchResultCount"></Badge>
                </div>
            </AccordionHeader>
            <AccordionContent
                :class="{ 'h-full': openAccordionPanel === 'data' }"
                class="overflow-y-scroll"
            >
                <AddressResultList /> </AccordionContent
        ></AccordionPanel>
    </Accordion>
</template>

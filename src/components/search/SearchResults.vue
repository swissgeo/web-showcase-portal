<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionContent from 'primevue/accordioncontent'
import AccordionHeader from 'primevue/accordionheader'
import AccordionPanel from 'primevue/accordionpanel'
import ProgressSpinner from 'primevue/progressspinner'
import { computed, inject, ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import AddressResultList from '@/components/search/AddressResultList.vue'
import GeocatResultList from '@/components/search/GeocatResultList.vue'
import { useSearchStore } from '@/store/search'

const searchStore = useSearchStore()
const { t } = useI18n()

const isDesktop = inject('isDesktop')

const showSpinner = computed(() => {
    return searchStore.searchTerm && searchStore.searchResults.length === 0
})

const showAddressSpinner = computed(() => {
    return searchStore.searchTerm && searchStore.searchLocationResults.length === 0
})

// which accordion panel is open
const openAccordionPanel: Ref<string | null> = ref(null)

function onUpdateAccordion(value: string | string[] | null | undefined) {
    if (Array.isArray(value)) {
        throw new Error('Multiple open accordions not supported')
    }
    openAccordionPanel.value = value || null
}
</script>

<template>
    <div class="overflow-hidden bg-white md:overflow-visible">
        <div
            v-if="isDesktop"
            class="flex h-full gap-4 px-4 pb-4"
        >
            <div class="h-full w-1/2 overflow-auto">
                <div class="h-full w-1/2 overflow-auto pr-2">
                    <div class="font-bold">{{ t('searchResult.addressTitle') }}</div>
                </div>
                <div
                    v-if="showAddressSpinner"
                    class="item-center flex justify-center"
                >
                    <ProgressSpinner />
                </div>
                <AddressResultList />
            </div>

            <div class="h-full w-1/2 overflow-auto border-l border-neutral-200 pl-2">
                <div class="font-bold">{{ t('searchResult.dataTitle') }}</div>
                <div
                    v-if="showSpinner"
                    class="item-center flex justify-center"
                >
                    <ProgressSpinner />
                </div>
                <GeocatResultList />
            </div>
        </div>
        <div
            v-else
            class="h-full min-h-0 flex-1 overflow-hidden"
        >
            <div
                v-if="showSpinner && showAddressSpinner"
                class="flex items-center justify-center"
            >
                <ProgressSpinner />
            </div>
            <Accordion
                v-else-if="
                    searchStore.searchResults.length || searchStore.searchLocationResults.length
                "
                class="flex h-full flex-col overflow-hidden"
                @update:value="onUpdateAccordion"
            >
                <AccordionPanel
                    v-if="searchStore.searchResults.length"
                    value="data"
                    class="overflow-hidden"
                    data-cy="comp-data-accordion"
                    :class="{ 'h-full': openAccordionPanel === 'data' }"
                >
                    <AccordionHeader>{{ t('searchResult.dataTitle') }}</AccordionHeader>
                    <AccordionContent
                        class="overflow-y-scroll"
                        data-cy="comp-data-accordion-content"
                        :class="{ 'h-full': openAccordionPanel === 'data' }"
                    >
                        <GeocatResultList />
                    </AccordionContent>
                </AccordionPanel>
                <AccordionPanel
                    v-if="searchStore.searchLocationResults.length"
                    data-cy="comp-address-accordion"
                    class=""
                    value="address"
                    :class="{ 'h-full': openAccordionPanel === 'address' }"
                >
                    <AccordionHeader>{{ t('searchResult.addressTitle') }}</AccordionHeader>
                    <AccordionContent :class="{ 'h-full': openAccordionPanel === 'data' }">
                        <AddressResultList />
                    </AccordionContent>
                    ></AccordionPanel
                >
            </Accordion>
        </div>
    </div>
</template>

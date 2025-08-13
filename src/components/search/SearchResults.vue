<script lang="ts" setup>
import Badge from 'primevue/badge'
import SelectButton from 'primevue/selectbutton'
import { ref, computed, watchEffect, inject } from 'vue'
import { useI18n } from 'vue-i18n'

import AddressResultList from '@/components/search/AddressResultList.vue'
import GeocatResultList from '@/components/search/GeocatResultList.vue'
import ParcelResultList from '@/components/search/ParcelResultList.vue'
import useSearchResults from '@/components/search/useSearchResults'

const { t } = useI18n()

const isDesktop = inject<boolean>('isDesktop', true)

const {
    showGeocatSpinner,
    showAddressSpinner,
    showParcelSpinner,
    geocatSearchResultCount,
    addressSearchResultCount,
    parcelSearchResultCount,
    isSearching,
} = useSearchResults()

const hasGeocatResults = computed(
    () => !!geocatSearchResultCount.value || !!showGeocatSpinner.value
)
const hasAddressResults = computed(
    () => !!addressSearchResultCount.value || !!showAddressSpinner.value
)
const hasParcelResults = computed(
    () => !!parcelSearchResultCount.value || !!showParcelSpinner.value
)

type SegKey = 'data' | 'address' | 'parcel'
type Seg = { value: SegKey; label: string; loading: boolean; count: number }

const active = ref<SegKey>('data')

// this allows to only show the segments that have data
const segments = computed<Seg[]>(() => {
    const list: Seg[] = []
    if (hasGeocatResults.value) {
        list.push({
            value: 'data',
            label: t('searchResult.dataTitle'),
            loading: showGeocatSpinner.value,
            count: showGeocatSpinner.value ? 0 : geocatSearchResultCount.value,
        })
    }
    if (hasAddressResults.value) {
        list.push({
            value: 'address',
            label: t('searchResult.placesTitle'),
            loading: showAddressSpinner.value,
            count: showAddressSpinner.value ? 0 : addressSearchResultCount.value,
        })
    }
    if (hasParcelResults.value) {
        list.push({
            value: 'parcel',
            label: t('searchResult.parcelsTitle'),
            loading: showParcelSpinner.value,
            count: showParcelSpinner.value ? 0 : parcelSearchResultCount.value,
        })
    }
    return list
})

const cols = computed(() => {
    const n = segments.value.length
    return n <= 1 ? 1 : n === 2 ? 2 : 3
})

const gridColsClass = computed(() =>
    cols.value === 1 ? 'grid-cols-1' : cols.value === 2 ? 'grid-cols-2' : 'grid-cols-3'
)

const selectButtonPT = computed(() => ({
    root: { class: `grid ${gridColsClass.value}` },
    button: 'w-full p-0 min-w-0 justify-start',
}))

// Keep active valid when segments change
watchEffect(() => {
    const values = segments.value.map((s) => s.value)
    if (!values.length) {
        active.value = 'data'
    } else if (!values.includes(active.value)) {
        active.value = values[0]
    }
})
</script>

<template>
    <div
        v-if="isSearching && segments.length"
        class="overflow-none"
        data-cy="comp-search-selectbutton"
    >
        <SelectButton
            v-model="active"
            :options="segments"
            option-label="label"
            option-value="value"
            size="small"
            class="w-full"
            :allow-empty="false"
            :pt="selectButtonPT"
        >
            <template #option="{ option }">
                <div
                    :data-cy="`search-tab-${option.value}`"
                    class="w-full min-w-0 items-center gap-2 px-2 py-1 text-sm"
                    :class="{
                        grid: !isDesktop && segments.length > 2,
                        flex: isDesktop,
                    }"
                >
                    <span
                        class="min-w-0 whitespace-nowrap"
                        :class="{
                            'p-1': !isDesktop,
                        }"
                        :title="option.label"
                    >
                        {{ option.label }}
                    </span>
                    <Badge
                        :value="option.count"
                        class="shrink-0"
                        severity="danger"
                    />
                </div>
            </template>
        </SelectButton>

        <div class="mt-3">
            <div
                v-show="active === 'data'"
                data-cy="comp-data-panel"
            >
                <GeocatResultList />
            </div>

            <div
                v-show="active === 'address'"
                data-cy="comp-address-panel"
            >
                <AddressResultList />
            </div>

            <div
                v-show="active === 'parcel'"
                data-cy="comp-parcel-panel"
            >
                <ParcelResultList />
            </div>
        </div>
    </div>
    <div
        v-else
        class="flex h-full items-center justify-center"
        data-cy="comp-search-no-results"
    >
        <span class="text-gray-500">
            {{ t('searchResult.noResults') }}
        </span>
    </div>
</template>

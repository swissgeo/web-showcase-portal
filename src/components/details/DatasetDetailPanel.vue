<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import { watch, onMounted, ref, inject, computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import DatasetDetails from '@/components/details/DatasetDetails.vue'
import useGeocat from '@/search/geocat'
import { useMainStore } from '@/store/main'

const isDesktop = inject<Ref<boolean>>('isDesktop')

const { t } = useI18n()
const mainStore = useMainStore()
const { infoLayerId } = storeToRefs(mainStore)
const geocat = useGeocat()

const layerInfo = ref('')

const fetchInfo = async () => {
    layerInfo.value = ''
    if (mainStore.infoLayerId) {
        geocat.getRecordDetails(mainStore.infoLayerId)
    }
}

const icon = computed(() => {
    const icon = ['pi']
    if (isDesktop?.value) {
        icon.push('pi-times')
    } else {
        icon.push('pi-chevron-left')
    }
    return icon.join(' ')
})

const info = computed(() => {
    return mainStore.infoLayerRecord
})

onMounted(async () => {
    fetchInfo()
})

const close = () => {
    mainStore.resetInfoLayerId()
}

watch(infoLayerId, fetchInfo)

// The Panel has a bit of additional styling to achieve two things:
// * Make it overflow scrollable
// * Swap the order of button and title on mobile and center the title
</script>

<template>
    <div
        class="dataset-detail fixed top-4 right-0 bottom-0 z-15 h-full w-full md:top-0 md:w-[420px]"
    >
        <Panel
            class="h-full"
            :pt="{
                contentContainer: { class: 'overflow-hidden h-full' },
                content: { class: 'overflow-hidden h-full !px-0 pt-0' },
                header: { class: '!justify-center md:!justify-between h-16' },
                headerActions: { class: 'order-1 md:order-2 absolute left-4 md:static' },
            }"
        >
            <template #header>
                <div
                    class="md:text-lef md:m-initial order-2 flex items-center justify-start gap-2 font-bold md:order-1"
                >
                    <i class="pi pi-info-circle" />
                    {{ t('details.header') }}
                </div>
            </template>
            <template #icons>
                <Button
                    :text="true"
                    :icon="icon"
                    @click="close"
                />
            </template>
            <!-- pb-20/pb-28 is needed so the content at the bottom becomes visible -->
            <DatasetDetails
                v-if="info"
                :info="info"
            />
        </Panel>
    </div>
</template>

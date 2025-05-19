<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import { watch, onMounted, ref, inject, computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useMainStore } from '@/store/main'

const isDesktop = inject<Ref<boolean>>('isDesktop')

const { t } = useI18n()
const mainStore = useMainStore()
const { infoLayerId } = storeToRefs(mainStore)

const layerInfo = ref('')

const fetchInfo = async () => {
    // TODO implement
    layerInfo.value = ''
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
                content: { class: 'overflow-hidden h-full' },
                header: { class: '!justify-center md:!justify-between' },
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
                <!-- we'll probably have to move the icon to the left side on mobile -->
                <Button
                    :text="true"
                    :icon="icon"
                    @click="close"
                />
            </template>
            <!-- pb-20/pb-28 is needed so the content at the bottom becomes visible -->
            <div class="h-full overflow-scroll border-t border-neutral-200 pt-4 pb-28 md:pb-20">
                <div class="flex flex-col gap-4">
                    <div class="text-lg font-bold">
                        Electrical installations with a nominal voltage exceeding 36k Volt
                    </div>

                    <!-- TODO probably refactor these into a reusable component -->
                    <Panel :header="t('details.info')">
                        The electricity grid is the point of connection between producers and
                        consumers of electrical energy. Via the grid, electricity is transported,
                        transformed (from a higher to lower voltage and vice versa) and distributed.
                        As the link between production and consumption, the electricity grid is a
                        key element in ensuring the security of electricity supply. The term
                        electrical installations refers to all components of an electricity network
                        that serve to transmit electrical current, such as lines, substations and
                        transformer stations. The geodatabase dataset 'Electrical installations with
                        a nominal voltage exceeding 36kV' contains a geographical overview of the
                        electrical installations of the extra-high and high-voltage grid in
                        Switzerland. Some plant operators have not yet provided data, so the
                        overview is not yet complete.
                    </Panel>

                    <Panel :header="t('details.contact')">
                        <address>Bundesamt für BGDI Seftigenstrasse</address>
                    </Panel>

                    <Panel :header="t('details.downloads')">
                        <a href="http://swisstopo.ch">Swisstopo</a>
                    </Panel>
                </div>
            </div>
        </Panel>
    </div>
</template>

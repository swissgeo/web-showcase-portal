<script setup lang="ts">
import { format } from 'date-fns'
import { Link as LinkIcon, Mail as MailIcon, MapPin } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import { watch, onMounted, ref, inject, computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import DetailLink from '@/components/DetailLink.vue'
import useGeocat from '@/search/geocat'
import { useMainStore } from '@/store/main'
import { getLegalConstraint, getLicense, getResources } from '@/utils/layerUtils'

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

const lastUpdated = computed(() => {
    if (info.value?.recordUpdated) {
        return format(info.value?.recordUpdated, 'dd.MM.yyyy')
    }
    return ''
})

const contact = computed(() => {
    return info.value?.contacts[0] ?? null
})

const downloads = computed(() => {
    if (info.value) {
        return getResources('download', info.value)
    }
    return []
})

const links = computed(() => {
    if (info.value) {
        const links = getResources('link', info.value)

        const legalConstraint = getLegalConstraint(info.value)
        if (legalConstraint) {
            links.push({
                url: legalConstraint,
                description: t('details.legalConstraints'),
                name: t('details.legalConstraints'),
                type: 'link',
            })
        }

        const license = getLicense(info.value)
        if (license) {
            links.push({
                url: license,
                description: t('details.license'),
                name: t('details.license'),
                type: 'link',
            })
        }

        links.push({
            url: new URL(`https://www.geocat.ch/datahub/dataset/${info.value.uniqueIdentifier}`),
            description: t('details.geocatLink'),
            name: t('details.geocatLink'),
            type: 'link',
        })

        return links
    }
    return []
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
                <!-- we'll probably have to move the icon to the left side on mobile -->
                <Button
                    :text="true"
                    :icon="icon"
                    @click="close"
                />
            </template>
            <!-- pb-20/pb-28 is needed so the content at the bottom becomes visible -->
            <div class="h-full overflow-scroll border-t border-neutral-200 pb-28 md:pb-20">
                <div class="">
                    <div
                        class="flex min-h-[230px] flex-col justify-end gap-3 bg-slate-200 px-4 pb-11 text-lg font-bold"
                    >
                        {{ info?.title }}

                        <div class="rounded-md bg-white p-2 text-sm font-medium">
                            {{ t('details.lastUpdated') }}
                            {{ lastUpdated }}
                        </div>
                    </div>

                    <div class="mx-4 flex -translate-y-5 flex-col gap-4">
                        <Panel :header="t('details.info')">
                            {{ mainStore.infoLayerRecord?.abstract }}
                        </Panel>

                        <Panel
                            v-if="contact"
                            :header="t('details.contact')"
                        >
                            <address class="text-sm not-italic">
                                <div class="flex flex-col gap-1">
                                    <div class="mb-2">
                                        <div class="font-bold">{{ contact.organization.name }}</div>
                                        <div
                                            v-if="contact.lastName"
                                            class="font-bold"
                                        >
                                            {{ contact.lastName }}
                                        </div>
                                    </div>
                                    <div v-if="contact.email">
                                        <a
                                            href="mailto:{{contact.email}}"
                                            class="flex items-center gap-2"
                                            ><LinkIcon class="h-4" />{{ contact.email }}</a
                                        >
                                    </div>
                                    <div v-if="contact.phone">
                                        <a
                                            href="tel:{{contact.phone}}"
                                            class="flex items-center gap-2"
                                            ><MailIcon class="h-4" />{{ contact.phone }}</a
                                        >
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <MapPin class="h-4" />{{ contact.address }}
                                    </div>
                                </div>
                            </address>
                        </Panel>

                        <Panel
                            v-if="downloads.length"
                            :header="t('details.downloads')"
                        >
                            <ul>
                                <DetailLink
                                    v-for="download in downloads"
                                    :key="download.name"
                                    :data="download"
                                ></DetailLink>
                            </ul>
                        </Panel>

                        <Panel
                            v-if="links.length"
                            :header="t('details.links')"
                        >
                            <ul>
                                <DetailLink
                                    v-for="link in links"
                                    :key="link.name"
                                    :data="link"
                                ></DetailLink>
                            </ul>
                        </Panel>
                    </div>
                </div>
            </div>
        </Panel>
    </div>
</template>

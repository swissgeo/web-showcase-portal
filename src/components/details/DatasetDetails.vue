<script lang="ts" setup>
import { format } from 'date-fns'
import { Phone as PhoneIcon, Mail as MailIcon, MapPin } from 'lucide-vue-next'
import Panel from 'primevue/panel'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { GeonetworkRecord } from '@/types/gnRecord'

import DetailLink from '@/components/details/DetailLink.vue'
import { getResources, getLegalConstraint, getLicense } from '@/utils/layerUtils'

const { t } = useI18n()

const { info } = defineProps<{
    info: GeonetworkRecord
}>()

const lastUpdated = computed(() => {
    if (info.recordUpdated) {
        try {
            return format(info?.recordUpdated, 'dd.MM.yyyy')
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error formatting date:', error)
            return info?.recordUpdated
        }
    }
    return ''
})

const contact = computed(() => {
    return info?.contacts[0] ?? null
})

const downloads = computed(() => {
    if (info) {
        return getResources('download', info)
    }
    return []
})

const links = computed(() => {
    if (info) {
        const links = getResources('link', info)

        const legalConstraint = getLegalConstraint(info)
        if (legalConstraint) {
            links.push({
                url: legalConstraint,
                description: t('details.legalConstraints'),
                name: t('details.legalConstraints'),
                type: 'link',
            })
        }

        const license = getLicense(info)
        if (license) {
            links.push({
                url: license,
                description: t('details.license'),
                name: t('details.license'),
                type: 'link',
            })
        }

        links.push({
            url: new URL(`https://www.geocat.ch/datahub/dataset/${info.uniqueIdentifier}`),
            description: t('details.geocatLink'),
            name: t('details.geocatLink'),
            type: 'link',
        })

        return links
    }
    return []
})

const logoUrl = computed((): string | null => {
    if (!info.ownerOrganization.logoUrl) {
        return null
    }
    try {
        const url = new URL(info.ownerOrganization.logoUrl)
        const filename = url.pathname.split('/').pop()
        return `https://www.geocat.ch/geonetwork/images/harvesting/${filename}`
    } catch {
        return null
    }
})
</script>

<template>
    <div class="h-full overflow-scroll border-t border-neutral-200 pb-28 md:pb-20">
        <div>
            <div
                class="flex min-h-[230px] flex-col justify-end gap-3 bg-slate-200 px-8 pb-11 text-xl font-bold"
                data-cy="div-dataset-details-title"
            >
                {{ info?.title }}

                <div class="w-fit rounded-md bg-white px-3 py-2 text-sm font-medium">
                    {{ t('details.lastUpdated') }}
                    {{ lastUpdated }}
                </div>
            </div>

            <div class="mx-4 flex -translate-y-5 flex-col gap-4">
                <Panel
                    v-if="contact"
                    :header="t('details.contact')"
                    data-cy="panel-dataset-details-contact"
                >
                    <template #icons>
                        <div
                            v-if="logoUrl"
                            class="flex h-10 min-w-10 items-center justify-center rounded-lg border border-neutral-100 p-1"
                        >
                            <img
                                :src="logoUrl"
                                class="max-h-full"
                            />
                        </div>
                    </template>
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
                                    :href="`mailto:${contact.email}`"
                                    class="flex items-center gap-2"
                                    ><MailIcon class="h-4 flex-shrink-0" />{{ contact.email }}</a
                                >
                            </div>
                            <div v-if="contact.phone">
                                <a
                                    :href="`tel:${contact.phone}`"
                                    class="flex items-center gap-2"
                                    ><PhoneIcon class="h-4 flex-shrink-0" />{{ contact.phone }}</a
                                >
                            </div>
                            <div class="flex items-center gap-2">
                                <MapPin class="h-4 flex-shrink-0" />{{ contact.address }}
                            </div>
                        </div>
                    </address>
                </Panel>

                <Panel
                    v-if="downloads.length"
                    :header="t('details.downloads')"
                    data-cy="panel-dataset-details-downloads"
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
                    data-cy="panel-dataset-details-links"
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
</template>

<script lang="ts" setup>
import { Phone as PhoneIcon, Mail as MailIcon, MapPin } from 'lucide-vue-next'
import Panel from 'primevue/panel'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import DetailLink from '@/components/details/DetailLink.vue'
import { type OnlineResourceType } from '@/types/gnRecord'
import { parseGeocatalogHtml } from '@/utils/parseGeocatalogHtml'

const { t } = useI18n()

const { content } = defineProps<{
    content: string
}>()

const parsed = computed(() => parseGeocatalogHtml(content))

const title = computed(() => parsed.value.title || 'Geocatalog Layer')
const lastUpdated = computed(() => parsed.value.lastUpdated || 'N/A')

const abstract = computed(() => parsed.value.abstract || 'No abstract available for this geocatalog layer.')

const contact = computed(() => {
    return {
        organization: {
            name: 'Geocatalog Organization',
        },
        lastName: 'Doe',
        email: '',
        phone: '123-456-789',
        address: '123 Geocatalog St, Geocity',
    }}
)
const logoUrl = computed(() => {
    return null
})

const downloads = computed(() => parsed.value.downloads.map(download => ({
    name: download.text,
    url: new URL(download.href, window.location.origin),
    description: '',
    type: 'link' as OnlineResourceType,
})) )

const links = computed(() => {
    return parsed.value.links.map(link => ({
        name: link.text,
        url: new URL(link.href, window.location.origin),
        description: '',
        type: 'link' as OnlineResourceType,
    }))
})



</script>

<template>
    <div class="h-full overflow-scroll border-t border-neutral-200 pb-28 md:pb-20">
        <div>
            <div
                class="flex min-h-[230px] flex-col justify-end gap-3 bg-slate-200 px-8 pb-11 text-xl font-bold"
                data-cy="div-dataset-details-title"
            >
                {{ title }}

                <div class="w-fit rounded-md bg-white px-3 py-2 text-sm font-medium">
                    {{ t('details.lastUpdated') }}
                    {{ lastUpdated }}
                </div>
            </div>

            <div class="mx-4 flex -translate-y-5 flex-col gap-4">
                <Panel
                    :header="t('details.info')"
                    data-cy="panel-dataset-details-info"
                >
                    {{ abstract }}
                </Panel>

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

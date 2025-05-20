<script setup lang="ts">
import AccordionContent from 'primevue/accordioncontent'
import AccordionHeader from 'primevue/accordionheader'
import AccordionPanel from 'primevue/accordionpanel'

import type { Layer } from '@/types/Layer'

const { layer } = defineProps<{
    layer: Layer
}>()
</script>

<template>
    <AccordionPanel :value="layer.id">
        <AccordionHeader>{{ layer.name }}</AccordionHeader>
        <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta dolor doloremque
            cupiditate recusandae sed explicabo accusamus vero? Asperiores, illo. Ea nobis natus
            debitis commodi sed amet repellat iste neque quae.
        </AccordionContent>
    </AccordionPanel>
</template>

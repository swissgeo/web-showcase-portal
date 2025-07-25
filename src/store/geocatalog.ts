import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'

import { useTopicTree } from '@/composables/useTopicTree'
import { useMainStore } from '@/store/main'
import { type GeocatalogTopic, type TopicTreeNode } from '@/types/geocatalog'

const TARGET_GROUP_IDS = [2, 3] // This is the only group IDs for the Geocatalog topics we want to show

const DEFAULT_GEOCATALOG_TOPIC: GeocatalogTopic = {
    id: 'ech',
    defaultBackground: 'ch.swisstopo.pixelkarte-farbe',
    groupId: 3,
    selectedLayers: [],
    plConfig: null,
}

export const useGeocatalogStore = defineStore('geocatalog', () => {
    const mainStore = useMainStore()
    const { fetchAndPrepareTopicTreeRoot, activateLayersOfSelectedTopic } = useTopicTree()
    // State
    const expandedKeys = ref<string[]>([])
    const topicTreeData = ref<Record<string, Record<string, TopicTreeNode | null>>>({})

    const currentTopic: Ref<GeocatalogTopic> = ref(DEFAULT_GEOCATALOG_TOPIC)
    const geocatalogTopicRoot: Ref<TopicTreeNode | null> = ref(null)
    const topics = ref<GeocatalogTopic[]>([])

    // Getter
    const getTopicTreeRoot = computed(() => (topic: string, lang: string) => {
        return topicTreeData.value[topic]?.[lang] || null
    })

    // Actions
    function addExpandedKey(key: string) {
        if (!expandedKeys.value.includes(key)) {
            expandedKeys.value.push(key)
        }
    }

    function removeExpandedKey(key: string) {
        const idx = expandedKeys.value.indexOf(key)
        if (idx !== -1) {
            expandedKeys.value.splice(idx, 1)
        }
    }

    function setGeocatalogTopicRoot(topic: TopicTreeNode) {
        geocatalogTopicRoot.value = topic
    }

    function setTopicTreeRoot(topic: string, lang: string, root: TopicTreeNode | null) {
        if (!topicTreeData.value[topic]) {
            topicTreeData.value[topic] = {}
        }
        topicTreeData.value[topic][lang] = root
    }

    function setCurrentTopic(topic: GeocatalogTopic) {
        currentTopic.value = topic
        fetchAndPrepareTopicTreeRoot(topic.id, mainStore.language).then(
            activateLayersOfSelectedTopic
        )
    }

    function setTopics(newTopics: GeocatalogTopic[]) {
        topics.value = newTopics.filter((t) => TARGET_GROUP_IDS.includes(t.groupId))
    }

    return {
        // State
        expandedKeys,
        topicTreeData,
        currentTopic,
        topics,
        geocatalogTopicRoot,
        // Getter
        getTopicTreeRoot,
        // Actions
        addExpandedKey,
        removeExpandedKey,
        setTopicTreeRoot,
        setGeocatalogTopicRoot,
        setCurrentTopic,
        setTopics,
    }
})

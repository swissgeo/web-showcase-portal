import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { type GeocatalogTopic, type TopicTreeNode } from '@/types/geocatalog'

export const useGeocatalogStore = defineStore('geocatalog', () => {
    // State
    const expandedKeys = ref<string[]>([])
    const topicTreeData = ref<Record<string, Record<string, TopicTreeNode | null>>>({})
    const currentTopic = ref('ech')
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

    function setTopicTreeRoot(topic: string, lang: string, root: TopicTreeNode | null) {
        if (!topicTreeData.value[topic]) {
            topicTreeData.value[topic] = {}
        }
        topicTreeData.value[topic][lang] = root
    }

    function setCurrentTopic(topic: string) {
        currentTopic.value = topic
    }

    function setTopics(newTopics: GeocatalogTopic[]) {
        topics.value = newTopics
    }

    return {
        // State
        expandedKeys,
        topicTreeData,
        currentTopic,
        topics,
        // Getter
        getTopicTreeRoot,
        // Actions
        addExpandedKey,
        removeExpandedKey,
        setTopicTreeRoot,
        setCurrentTopic,
        setTopics,
    }
})

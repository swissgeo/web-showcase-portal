import { defineStore } from 'pinia'

import { type GeocatalogTopic, type TopicTreeNode } from '@/types/geocatalog'

export interface GeocatalogStoreState {
    expandedKeys: string[]
    topicTreeData: Record<string, Record<string, TopicTreeNode | null>>
    currentTopic: string
    topics: GeocatalogTopic[]
}

export const useGeocatalogStore = defineStore('geocatalog', {
    state: (): GeocatalogStoreState => {
        return {
            expandedKeys: [],
            topicTreeData: {},
            currentTopic: 'ech',
            topics: [],
        }
    },
    getters: {
        getTopicTreeRoot: (state) => (topic: string, lang: string) => {
            return state.topicTreeData[topic]?.[lang] || null
        },
    },
    actions: {
        addExpandedKey(key: string) {
            if (!this.expandedKeys.includes(key)) {
                this.expandedKeys.push(key)
            }
        },
        removeExpandedKey(key: string) {
            const idx = this.expandedKeys.indexOf(key)
            if (idx !== -1) {
                this.expandedKeys.splice(idx, 1)
            }
        },
        setTopicTreeRoot(topic: string, lang: string, root: TopicTreeNode | null) {
            if (!this.topicTreeData[topic]) {
                this.topicTreeData[topic] = {}
            }
            this.topicTreeData[topic][lang] = root
        },
        setCurrentTopic(topic: string) {
            this.currentTopic = topic
        },
        setTopics(topics: GeocatalogTopic[]) {
            this.topics = topics
        },
    },
})

export interface TopicTreeNode {
    id: number | string
    label?: string
    category: string
    children?: TopicTreeNode[]
    layerBodId?: string
    [key: string]: unknown
}

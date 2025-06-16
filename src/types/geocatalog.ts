export interface TopicTreeNode {
    id: number | string
    layerBodId: string
    label: string // Similar to name in Layer
    category: string
    children?: TopicTreeNode[]
}

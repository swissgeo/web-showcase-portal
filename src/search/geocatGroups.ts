export interface GroupLabel {
    ger?: string;
    ita?: string;
    fre?: string;
    roh?: string;
    eng?: string;
    [key: string]: string | undefined;
}

export interface Category {
    id: number;
    name: string;
}

export interface Group {
    id: number;
    website: string;
    name: string;
    label: GroupLabel;
    defaultCategory: Category | null;
}

import geocatGroups from '@/assets/geocatGroups.json'

interface RawGroup {
    id: number;
    website: string;
    name: string;
    label: GroupLabel;
    defaultCategory: Category[] | string | null;
}

export async function fetchGeocatGroups(): Promise<Group[]> {
    return (geocatGroups as RawGroup[]).map((group) => ({
        id: group.id,
        website: group.website,
        name: group.name,
        label: group.label,
        defaultCategory:
            group.defaultCategory && typeof group.defaultCategory === 'object' && !Array.isArray(group.defaultCategory)
                ? group.defaultCategory as Category
                : null,
    }));
}

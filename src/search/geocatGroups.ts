export interface GroupLabel {
    ger?: string;
    ita?: string;
    fre?: string;
    roh?: string;
    eng?: string;
    [key: string]: string | undefined;
}

export interface Group {
    id: number;
    website: string;
    label: GroupLabel;
    allowedCategories: string[];
}

import geocatGroups from '@/assets/geocatGroups.json'

export async function fetchGeocatGroups(): Promise<Group[]> {
    return geocatGroups as Group[];
}

// // CORS issue, so we use a local JSON file instead
// const API_URL = 'https://www.geocat.ch/geonetwork/srv/api/groups';

// interface RawGroup {
//     id: number;
//     website: string;
//     label: GroupLabel;
//     allowedCategories: { name: string }[];
//     name: string;
//     logo: string;
//     email: string;
//     description: string;
// }

// export async function fetchGeocatGroups(): Promise<Group[]> {
//     const response = await fetch(API_URL);
//     const data = await response.json();

//     return (data as RawGroup[]).map((group) => ({
//         id: group.id,
//         website: group.website,
//         label: group.label,
//         allowedCategories: Array.isArray(group.allowedCategories)
//             ? group.allowedCategories.map((cat) => cat.name)
//             : [],
//         name: group.name,
//         logo: group.logo,
//         email: group.email,
//         description: group.description,
//     }));
// }

export function getGroupLabel(
    label: GroupLabel,
    lang: string = 'eng'
): string {
    return label[lang] || Object.values(label)[0] || '';
}

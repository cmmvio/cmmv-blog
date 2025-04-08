export type ICategory = {
    id: string;
    name: string;
    slug: string;
    parentCategory: string;
    active: boolean;
    navigationLabel: string;
    postCount: number;
}

export type ITag = {
    id: string;
    name: string;
    slug: string;
    postCount: number;
}


export type ICategory = {
    id: string;
    name: string;
    slug: string;
    parentCategory: string;
    active: boolean;
    navigationLabel: string;
    totalPosts: number;
}

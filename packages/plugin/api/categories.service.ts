import {
    Service,
} from "@cmmv/core";

import {
    Repository
} from "@cmmv/repository";

@Service('blog_categories_public')
export class CategoriesPublicService {
    /**
     * Get all categories
     * @param queries
     * @param req
     * @returns
     */
    async getAll(queries: any, req: any) {
        const CategoriesEntity = Repository.getEntity("CategoriesEntity");
        const categories = await Repository.findAll(CategoriesEntity, queries, [], {
            select: [ "id", "name", "slug", "parentCategory", "active", "navigationLabel" ]
        });
        return (categories) ? JSON.stringify(categories.data) : [];
    }
}

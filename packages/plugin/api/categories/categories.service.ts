import {
    Service,
} from "@cmmv/core";

import {
    Repository, MoreThan
} from "@cmmv/repository";

import {
    PostsPublicService
} from "../posts/posts.service";

@Service('blog_categories_public')
export class CategoriesPublicService {

    constructor(
        private readonly postsService: PostsPublicService
    ){}

    /**
     * Get all categories
     * @param queries
     * @param req
     * @returns
     */
    async getAll(queries: any, req: any) {
        const CategoriesEntity = Repository.getEntity("CategoriesEntity");

        const categories = await Repository.findAll(CategoriesEntity, {
            limit: 1000,
            active: true,
            postCount: MoreThan(0)
        }, [], {
            select: [ "id", "name", "slug", "parentCategory", "active", "navigationLabel", "postCount" ]
        });

        return (categories) ? JSON.stringify(categories.data) : [];
    }

    /**
     * Get a category by slug
     * @param slug
     * @returns
     */
    async getBySlug(slug: string, queries: any) {
        const CategoriesEntity = Repository.getEntity("CategoriesEntity");

        const category = await Repository.findOne(CategoriesEntity, Repository.queryBuilder({
            slug
        }), { select: [ "id" ] });

        if(!category)
            throw new Error("Category not found");

        return this.getById(category.id, queries);
    }

    /**
     * Get a category by id
     * @param id
     * @returns
     */
    async getById(id: string, queries: any) {
        const CategoriesEntity = Repository.getEntity("CategoriesEntity");

        const category = await Repository.findOne(CategoriesEntity, Repository.queryBuilder({
            id
        }), {
            select: [ "id", "name", "slug", "parentCategory", "active", "navigationLabel", "postCount", "description" ]
        });

        const posts = await this.postsService.getPostsByCategory(id, queries);

        return {
            category: category,
            posts: posts
        };
    }
}

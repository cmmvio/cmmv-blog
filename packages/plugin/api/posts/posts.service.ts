import {
    Service,
} from "@cmmv/core";

import {
    Repository, In
} from "@cmmv/repository";

import {
    IPostMetadata,
    IDraftPost
} from "./posts.interface";

import {
    slugify
} from "../utils/extra.utils";

import {
    MediasService
} from "../medias/medias.service";

@Service('blog_posts_public')
export class PostsPublicService {
    constructor(private readonly mediasService: MediasService){}

    /**
     * Get all posts
     * @param {any} queries - The queries
     * @param {any} req - The request
     * @returns {Promise<any>}
     */
    async getAllPosts(queries: any, req: any) {
        const PostsEntity = Repository.getEntity("PostsEntity");
        const ProfilesEntity = Repository.getEntity("ProfilesEntity");
        const CategoriesEntity = Repository.getEntity("CategoriesEntity");

        const posts = await Repository.findAll(PostsEntity, {
            ...queries,
            type: "post"
        }, [], {
            select: [
                "id", "title", "slug", "content", "status", "autoPublishAt",
                "authors", "author", "categories", "featureImage", "publishedAt",
                "updatedAt", "createdAt", "comments", "views"
            ]
        });

        let authors: any[] = [];
        let categories: any[] = [];

        if(posts){
            let userIdsIn: string[] = [];
            let categoryIdsIn: string[] = [];

            for(const post of posts.data){
                userIdsIn = [...userIdsIn, ...post.authors];
                userIdsIn.push(post.author);
                categoryIdsIn = [...categoryIdsIn, ...post.categories];

                const categoriesData = await Repository.findAll(CategoriesEntity, {
                    id: In(post.categories),
                    limit: 100
                }, [], {
                    select: [ "id", "name", "slug", "description" ]
                });

                post.categories = (categoriesData) ? categoriesData.data : [];

                post.featureImage = await this.mediasService.getImageUrl(
                    post.featureImage,
                    "webp",
                    1200,
                    post.featureImageAlt,
                    post.featureImageCaption
                );
            }

            //@ts-ignore
            const usersIn = [...new Set(userIdsIn)];
            //@ts-ignore
            const categoryIn = [...new Set(categoryIdsIn)];

            const authorsData = await Repository.findAll(ProfilesEntity, {
                user: In(usersIn),
                limit: 100
            }, [], {
                select: [
                    'id', 'user', 'name', 'slug', 'image', 'coverImage',
                    'bio', 'website', 'location', 'facebook', 'twitter', 'locale',
                    'visibility', 'metaTitle', 'metaDescription', 'lastSeen',
                    'commentNotifications', 'mentionNotifications', 'recommendationNotifications'
                ]
            });

            if(authorsData){
                for(const author of authorsData.data){
                    author.image = await this.mediasService.getImageUrl(
                        author.image,
                        "webp",
                        128,
                        author.name,
                        author.name
                    );

                    author.coverImage = await this.mediasService.getImageUrl(
                        author.coverImage,
                        "webp",
                        1024,
                        author.name,
                        author.name
                    );
                }
            }


            authors = (authorsData) ? authorsData.data : [];

            const categoriesData = await Repository.findAll(CategoriesEntity, {
                id: In(categoryIn),
                limit: 100
            }, [], {
                select: [ "id", "name", "slug", "description" ]
            });

            categories = (categoriesData) ? categoriesData.data : [];
        }

        return {
            posts: (posts) ? posts.data : [],
            count: (posts) ? posts.count : 0,
            pagination: (posts) ? posts.pagination : null,
            authors,
            categories
        };
    }

    /**
     * Get all pages
     * @param {any} queries - The queries
     * @param {any} req - The request
     * @returns {Promise<any>}
     */
    async getAllPages(queries: any, req: any) {
        const PostsEntity = Repository.getEntity("PostsEntity");
        const ProfilesEntity = Repository.getEntity("ProfilesEntity");

        const posts = await Repository.findAll(PostsEntity, {
            ...queries,
            type: "page"
        }, [], {
            select: [
                "id", "title", "slug", "content", "status", "autoPublishAt",
                "authors", "author", "categories", "featureImage", "publishedAt",
                "updatedAt", "createdAt"
            ]
        });

        let authors: any[] = [];

        if(posts){
            let userIdsIn: string[] = [];

            for(const post of posts.data)
                userIdsIn.push(post.author);

            //@ts-ignore
            const usersIn = [...new Set(userIdsIn)];

            const authorsData = await Repository.findAll(ProfilesEntity, {
                user: In(usersIn),
                limit: 100
            }, [], {
                select: [
                    'id', 'user', 'name', 'slug', 'image', 'coverImage',
                    'bio', 'website', 'location', 'facebook', 'twitter', 'locale',
                    'visibility', 'metaTitle', 'metaDescription', 'lastSeen',
                    'commentNotifications', 'mentionNotifications', 'recommendationNotifications'
                ]
            });

            authors = (authorsData) ? authorsData.data : [];
        }

        return {
            posts: (posts) ? posts.data : [],
            count: (posts) ? posts.count : 0,
            pagination: (posts) ? posts.pagination : null,
            authors
        };
    }

    /**
     * Get all tags
     * @returns {Promise<any>}
     */
    async getTags(queries: any) {
        const TagsEntity = Repository.getEntity("TagsEntity");

        const tags = await Repository.findAll(TagsEntity, {
            ...queries,
            limit: 100
        }, [], {
            select: [ "id", "name", "slug", "description", "postCount" ]
        });

        return (tags) ? JSON.stringify(tags.data) : [];
    }

    /**
     * Draft a post
     * @param {IDraftPost} data.post - The post data
     * @param {IPostMetadata} data.meta - The post metadata
     * @returns {Promise<any>}
     */
    async savePost(data: {
        post: IDraftPost,
        meta: IPostMetadata
    }, user: any) {
        const PostsEntity = Repository.getEntity("PostsEntity");
        const MetaEntity = Repository.getEntity("MetaEntity");

        if(data.post.title.length < 3)
            throw new Error("The title must be at least 3 characters");

        if(data.post.title.length > 100)
            throw new Error("The title must be less than 100 characters");

        if(data.post.slug.length < 3)
            throw new Error("The slug must be at least 3 characters");

        if(data.post.slug.length > 100)
            throw new Error("The slug must be less than 100 characters");

        if(data.post && data.post.id && typeof data.post.id === "string") {
            if(data.post.meta)
                delete data.post.meta;

            if(data.post.authors){
                const authors = [...data.post.authors];
                data.post.authors = [];

                for(const author of authors){
                    //@ts-ignore
                    data.post.authors.push(author.user);
                }
            }

            data.post.type = "post";

            const post: any = await Repository.updateOne(
                PostsEntity, Repository.queryBuilder({ id: data.post.id }), data.post
            );

            if(post){
                await Repository.updateOne(MetaEntity, {
                    post: data.post.id
                }, data.meta);
            }

            await this.upsertTags(data.post.tags);
            await this.recalculateCategories();
            return { result: true };
        }
        else {
            data.post.author = user.id;
            data.post.type = "post";

            if(!data.post.authors || data.post.authors.length === 1)
                data.post.authors = [user.id];

            const post: any = await Repository.insert(PostsEntity, data.post);

            if(post){
                data.meta.post = post.data.id;
                await Repository.insert(MetaEntity, data.meta);
            }

            await this.upsertTags(data.post.tags);
            await this.recalculateCategories();

            return post.data;
        }
    }

    /**
     * Save a page
     * @param {IDraftPost} data.post - The post data
     * @param {IPostMetadata} data.meta - The post metadata
     * @returns {Promise<any>}
     */
    async savePage(data: {
        post: IDraftPost,
        meta: IPostMetadata
    }, user: any) {
        const PostsEntity = Repository.getEntity("PostsEntity");
        const MetaEntity = Repository.getEntity("MetaEntity");

        if(data.post.title.length < 3)
            throw new Error("The title must be at least 3 characters");

        if(data.post.title.length > 100)
            throw new Error("The title must be less than 100 characters");

        if(data.post.slug.length < 3)
            throw new Error("The slug must be at least 3 characters");

        if(data.post.slug.length > 100)
            throw new Error("The slug must be less than 100 characters");

        if(data.post && data.post.id && typeof data.post.id === "string") {
            data.post.type = "page";

            const page: any = await Repository.updateOne(
                PostsEntity, Repository.queryBuilder({ id: data.post.id }), data.post
            );

            if(page){
                await Repository.updateOne(MetaEntity, {
                    post: data.post.id
                }, data.meta);
            }

            return { result: true };
        }
        else {
            data.post.author = user.id;
            data.post.authors = [user.id];
            data.post.type = "page";

            const page: any = await Repository.insert(PostsEntity, data.post);

            console.log(page);

            if(page){
                data.meta.post = page.data.id;
                await Repository.insert(MetaEntity, data.meta);
            }

            return page.data;
        }
    }

    /**
     * Get a post by slug
     * @param {string} slug - The slug of the post
     * @returns {Promise<any>}
     */
    async getPostBySlug(slug: string) {
        const PostsEntity = Repository.getEntity("PostsEntity");
        const post: any = await Repository.findOne(PostsEntity, Repository.queryBuilder({
            slug,
            type: "post",
            status: "published"
        }));

        if(!post)
            throw new Error("Post not found");

        return this.getPostById(post.id);
    }

    /**
     * Get a post id by slug
     * @param {string} slug - The slug of the post
     * @returns {Promise<any>}
     */
    async getPostIdBySlug(slug: string) {
        const PostsEntity = Repository.getEntity("PostsEntity");
        const post: any = await Repository.findOne(PostsEntity, Repository.queryBuilder({
            slug,
            type: "post",
        }), {
            select: [ "id" ]
        });

        if(!post)
            throw new Error("Post not found");

        return post.id;
    }

    /**
     * Get a page by slug
     * @param {string} slug - The slug of the page
     * @returns {Promise<any>}
     */
    async getPageBySlug(slug: string) {
        const PostsEntity = Repository.getEntity("PostsEntity");

        const page: any = await Repository.findOne(PostsEntity, Repository.queryBuilder({
            slug,
            type: "page",
            status: "published"
        }));

        if(!page)
            throw new Error("Page not found");

        return this.getPageById(page.id);
    }

    /**
     * Get a post by id
     * @param {string} id - The id of the post
     * @returns {Promise<any>}
     */
    async getPostById(id: string) {
        const PostsEntity = Repository.getEntity("PostsEntity");
        const ProfilesEntity = Repository.getEntity("ProfilesEntity");
        const CategoriesEntity = Repository.getEntity("CategoriesEntity");
        const MetaEntity = Repository.getEntity("MetaEntity");
        const TagsEntity = Repository.getEntity("TagsEntity");

        const post: any = await Repository.findOne(PostsEntity, Repository.queryBuilder({
            id,
            type: "post"
        }), {
            select: [
                'id', 'title', 'slug', 'content', 'status', 'autoPublishAt', 'authors', 'author',
                'canonicalUrl', 'categories', 'codeInjectionBody', 'codeInjectionHead', 'excerpt',
                'featureImage', 'featureImageAlt', 'featureImageCaption', 'featured', 'image',
                'metaDescription', 'metaKeywords', 'metaTitle',
                'publishedAt', 'tags', 'type', 'visibility', 'createdAt', 'updatedAt'
            ]
        });

        if(post){
            post.featureImage = await this.mediasService.getImageUrl(
                post.featureImage,
                "webp",
                1200,
                post.featureImageAlt,
                post.featureImageCaption
            );

            const meta: any = await Repository.findOne(MetaEntity, Repository.queryBuilder({
                post: post.id
            }), {
                select: [
                    'id', 'post', 'metaDescription', 'metaTitle',
                    'ogDescription', 'ogImage', 'ogTitle', 'twitterDescription', 'twitterImage',
                    'twitterTitle'
                ]
            });

            post.meta = meta;

            let userIdsIn = [...post.authors];
            let categoryIdsIn = [...post.categories];

            //@ts-ignore
            const usersIn = [...new Set(userIdsIn)];
            //@ts-ignore
            const categoryIn = [...new Set(categoryIdsIn)];

            //Authors
            const authorsData = await Repository.findAll(ProfilesEntity, {
                user: In(usersIn),
                limit: 100
            }, [], {
                select: [
                    'id', 'user', 'name', 'slug', 'image', 'coverImage',
                    'bio', 'website', 'location', 'facebook', 'twitter',
                    'instagram', 'linkedin', 'github', 'locale',
                    'visibility', 'metaTitle', 'metaDescription'
                ]
            });

            post.authors = (authorsData) ? authorsData.data : [];

            for(let key in post.authors){
                post.authors[key].image = await this.mediasService.getImageUrl(
                    post.authors[key].image,
                    "webp",
                    128,
                    post.authors[key].name,
                    post.authors[key].name
                );

                post.authors[key].coverImage = await this.mediasService.getImageUrl(
                    post.authors[key].coverImage,
                    "webp",
                    1024,
                    post.authors[key].name,
                    post.authors[key].name
                );
            }

            const categoriesData = await Repository.findAll(CategoriesEntity, {
                id: In(categoryIn),
                limit: 100
            }, [], {
                select: [ "id", "name", "slug", "description" ]
            });

            post.categories = (categoriesData) ? categoriesData.data : [];

            //Tags
            const tagsData = await Repository.findAll(TagsEntity, {
                name: In(post.tags),
                limit: 100
            }, [], {
                select: [ "id", "name", "slug", "description" ]
            });

            post.tags = (tagsData) ? tagsData.data : [];
        }

        return JSON.stringify(post);
    }

    /**
     * Get a page by id
     * @param {string} id - The id of the page
     * @returns {Promise<any>}
     */
    async getPageById(id: string) {
        const PostsEntity = Repository.getEntity("PostsEntity");
        const ProfilesEntity = Repository.getEntity("ProfilesEntity");
        const MetaEntity = Repository.getEntity("MetaEntity");

        const page: any = await Repository.findOne(PostsEntity, Repository.queryBuilder({
            id,
            type: "page"
        }), {
            select: [
                'id', 'title', 'slug', 'content', 'status', 'autoPublishAt', 'author',
                'canonicalUrl', 'codeInjectionBody', 'codeInjectionHead', 'excerpt',
                'featureImage', 'featureImageAlt', 'featureImageCaption', 'featured', 'image',
                'metaDescription', 'metaKeywords', 'metaTitle',
                'publishedAt', 'tags', 'type', 'visibility', 'createdAt', 'updatedAt'
            ]
        });

        if(page){
            page.featureImage = await this.mediasService.getImageUrl(
                page.featureImage,
                "webp",
                1200,
                page.featureImageAlt,
                page.featureImageCaption
            );

            const meta: any = await Repository.findOne(MetaEntity, Repository.queryBuilder({
                post: page.id
            }), {
                select: [
                    'id', 'post', 'metaDescription', 'metaTitle',
                    'ogDescription', 'ogImage', 'ogTitle', 'twitterDescription', 'twitterImage',
                    'twitterTitle'
                ]
            });

            page.meta = meta;
            let userIdsIn = [page.author];

            //Authors
            const authorsData = await Repository.findAll(ProfilesEntity, {
                user: In(userIdsIn),
                limit: 100
            }, [], {
                select: [
                    'id', 'user', 'name', 'slug', 'image', 'coverImage',
                    'bio', 'website', 'location', 'facebook', 'twitter', 'instagram',
                    'linkedin', 'github', 'locale', 'visibility', 'metaTitle', 'metaDescription'
                ]
            });

            page.authors = (authorsData) ? authorsData.data : [];

            for(let key in page.authors){
                page.authors[key].image = await this.mediasService.getImageUrl(
                    page.authors[key].image,
                    "webp",
                    128,
                    page.authors[key].name,
                    page.authors[key].name
                );

                page.authors[key].coverImage = await this.mediasService.getImageUrl(
                    page.authors[key].coverImage,
                    "webp",
                    1024,
                    page.authors[key].name,
                    page.authors[key].name
                );
            }
        }

        return JSON.stringify(page);
    }

    /**
     * Get posts by category
     * @param {string} categoryId - The id of the category
     * @returns {Promise<any>}
     */
    async getPostsByCategory(categoryId: string) {
        const PostsEntity = Repository.getEntity("PostsEntity");
        const TagsEntity = Repository.getEntity("TagsEntity");

        const posts = await Repository.findAll(PostsEntity, {
            searchField: 'categories',
            search: categoryId,
            limit: 10,
            status: "published",
            sortBy: "publishedAt",
            sort: "DESC",
            type: "post"
        }, [], {
            select: [
                'id', 'title', 'slug', 'content', 'status', 'autoPublishAt', 'authors', 'author',
                'canonicalUrl', 'categories', 'codeInjectionBody', 'codeInjectionHead', 'excerpt',
                'featureImage', 'featureImageAlt', 'featureImageCaption', 'featured', 'image',
                'metaDescription', 'metaKeywords', 'metaTitle',
                'publishedAt', 'tags', 'type', 'visibility', 'createdAt', 'updatedAt'
            ]
        });

        if(posts){
            for(const post of posts.data){
                post.featureImage = await this.mediasService.getImageUrl(
                    post.featureImage,
                    "webp",
                    1200,
                )

                //Tags
                const tagsData = await Repository.findAll(TagsEntity, {
                    name: In(post.tags),
                    limit: 100
                }, [], {
                    select: [ "id", "name", "slug", "description" ]
                });

                post.tags = (tagsData) ? tagsData.data : [];
            }
        }

        return posts;
    }

    /**
     * Get posts by tag slug
     * @param {string} tagSlug - The slug of the tag
     * @returns {Promise<any>}
     */
    async getPostsByTagSlug(tagSlug: string) {
        const TagsEntity = Repository.getEntity("TagsEntity");
        const tag = await Repository.findOne(TagsEntity, { slug: tagSlug }, {
            select: [ "id", "name" ]
        });

        if(!tag)
            throw new Error("Tag not found");

        return this.getPostsByTag(tag.name);
    }

    /**
     * Get posts by tag
     * @param {string} tagName
     * @returns {Promise<any>}
     */
    async getPostsByTag(tagName: string) {
        const PostsEntity = Repository.getEntity("PostsEntity");
        const TagsEntity = Repository.getEntity("TagsEntity");

        const tag = await Repository.findOne(TagsEntity, { name: tagName }, {
            select: [ "id", "name", "slug", "description", "postCount" ]
        });

        const posts = await Repository.findAll(PostsEntity, {
            searchField: 'tags',
            search: tagName,
            limit: 10,
            status: "published",
            sortBy: "publishedAt",
            sort: "DESC",
            type: "post"
        }, [], {
            select: [
                'id', 'title', 'slug', 'content', 'status', 'autoPublishAt', 'authors', 'author',
                'canonicalUrl', 'categories', 'codeInjectionBody', 'codeInjectionHead', 'excerpt',
                'featureImage', 'featureImageAlt', 'featureImageCaption', 'featured', 'image',
                'metaDescription', 'metaKeywords', 'metaTitle',
                'publishedAt', 'tags', 'type', 'visibility', 'createdAt', 'updatedAt'
            ]
        });

        if(posts){
            for(const post of posts.data){
                post.featureImage = await this.mediasService.getImageUrl(
                    post.featureImage,
                    "webp",
                    1200,
                )

                //Tags
                const tagsData = await Repository.findAll(TagsEntity, {
                    name: In(post.tags),
                    limit: 100
                }, [], {
                    select: [ "id", "name", "slug", "description" ]
                });

                post.tags = (tagsData) ? tagsData.data : [];
            }
        }

        return { posts: posts ? posts.data : [], tag };
    }

    /**
     * Upsert tags
     * @param tags - The tags
     */
    async upsertTags(tags: string[]) {
        const TagsEntity = Repository.getEntity("TagsEntity");

        for(const tag of tags){
            const tagStoraged = await Repository.findOne(TagsEntity, { slug: tag });

            if(tagStoraged)
                continue;

            await Repository.insert(TagsEntity, { name: tag, slug: slugify(tag) });
        }

        await this.recalculateTags();
    }

    /**
     * Recalculate tags
     * @returns {Promise<void>}
     */
    async recalculateTags() {
        const TagsEntity = Repository.getEntity("TagsEntity");
        const PostsEntity = Repository.getEntity("PostsEntity");

        const tags = await Repository.findAll(TagsEntity, {
            limit: 1000
        });

        if(tags){
            for(const tag of tags.data){
                const postCount = await Repository.findAll(PostsEntity, {
                    limit: 10000,
                    searchField: 'tags',
                    search: tag.name
                }, [], {
                    select: [ "id" ]
                });

                if(postCount){
                    await Repository.updateOne(TagsEntity, { id: tag.id }, {
                        postCount: postCount.data.length
                    });
                }
            }
        }
    }

    /**
     * Recalculate categories
     * @returns {Promise<void>}
     */
    async recalculateCategories(){
        const CategoriesEntity = Repository.getEntity("CategoriesEntity");
        const PostsEntity = Repository.getEntity("PostsEntity");

        const categories = await Repository.findAll(CategoriesEntity, {
            limit: 1000
        });

        if(categories){
            for(const category of categories.data){
                const postCount = await Repository.findAll(PostsEntity, {
                    limit: 10000,
                    searchField: 'categories',
                    search: category.id
                }, [], {
                    select: [ "id" ]
                });

                if(postCount){
                    await Repository.updateOne(CategoriesEntity, { id: category.id }, {
                        postCount: postCount.data.length
                    });
                }
            }
        }
    }

    /**
     * Delete a post
     * @param {string} id - The id of the post
     * @returns {Promise<any>}
     */
    async deletePost(id: string) {
        const PostsEntity = Repository.getEntity("PostsEntity");
        const MetaEntity = Repository.getEntity("MetaEntity");
        await Repository.delete(MetaEntity, { post: id });
        const resultDelete = await Repository.delete(PostsEntity, { id });

        if(resultDelete){
            await this.recalculateTags();
            await this.recalculateCategories();
        }

        return { result: resultDelete };
    }
}

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
} from "./extra.utils";

import { MediasService } from "./medias.service";

@Service('blog_posts_public')
export class PostsPublicService {
    constructor(
        private readonly mediasService: MediasService
    ){}

    /**
     * Get all posts
     * @param {any} queries - The queries
     * @param {any} req - The request
     * @returns {Promise<any>}
     */
    async getAll(queries: any, req: any) {
        const PostsEntity = Repository.getEntity("PostsEntity");
        const ProfilesEntity = Repository.getEntity("ProfilesEntity");
        const CategoriesEntity = Repository.getEntity("CategoriesEntity");

        const posts = await Repository.findAll(PostsEntity, queries, [], {
            select: [
                "id", "title", "slug", "content", "status", "autoPublishAt",
                "authors", "author", "categories", "featureImage"
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
     * Get all tags
     * @returns {Promise<any>}
     */
    async getTags() {
        const TagsEntity = Repository.getEntity("TagsEntity");

        const tags = await Repository.findAll(TagsEntity, {
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
     * Get a post by id
     * @param {string} id - The id of the post
     * @returns {Promise<any>}
     */
    async getById(id: string) {
        const PostsEntity = Repository.getEntity("PostsEntity");
        const ProfilesEntity = Repository.getEntity("ProfilesEntity");
        const CategoriesEntity = Repository.getEntity("CategoriesEntity");
        const MetaEntity = Repository.getEntity("MetaEntity");
        const TagsEntity = Repository.getEntity("TagsEntity");

        const post: any = await Repository.findOne(PostsEntity, Repository.queryBuilder({
            id
        }), {
            select: [
                'id', 'title', 'slug', 'content', 'status', 'autoPublishAt', 'authors', 'author',
                'canonicalUrl', 'categories', 'codeInjectionBody', 'codeInjectionHead', 'excerpt',
                'featureImage', 'featureImageAlt', 'featureImageCaption', 'featured', 'image',
                'lexicalContent', 'metaDescription', 'metaKeywords', 'metaTitle', 'mobileDocument',
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
                    'bio', 'website', 'location', 'facebook', 'twitter', 'locale',
                    'visibility', 'metaTitle', 'metaDescription', 'lastSeen',
                    'commentNotifications', 'mentionNotifications', 'recommendationNotifications'
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

            //Categories
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
}

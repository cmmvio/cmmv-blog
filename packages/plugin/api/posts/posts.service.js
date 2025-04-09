"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsPublicService = void 0;
const core_1 = require("@cmmv/core");
const repository_1 = require("@cmmv/repository");
const extra_utils_1 = require("../utils/extra.utils");
const medias_service_1 = require("../medias/medias.service");
let PostsPublicService = class PostsPublicService {
    mediasService;
    constructor(mediasService) {
        this.mediasService = mediasService;
    }
    async getAllPosts(queries, req) {
        const PostsEntity = repository_1.Repository.getEntity("PostsEntity");
        const ProfilesEntity = repository_1.Repository.getEntity("ProfilesEntity");
        const CategoriesEntity = repository_1.Repository.getEntity("CategoriesEntity");
        const posts = await repository_1.Repository.findAll(PostsEntity, {
            ...queries,
            type: "post"
        }, [], {
            select: [
                "id", "title", "slug", "content", "status", "autoPublishAt",
                "authors", "author", "categories", "featureImage", "publishedAt",
                "updatedAt", "createdAt"
            ]
        });
        let authors = [];
        let categories = [];
        if (posts) {
            let userIdsIn = [];
            let categoryIdsIn = [];
            for (const post of posts.data) {
                userIdsIn = [...userIdsIn, ...post.authors];
                userIdsIn.push(post.author);
                categoryIdsIn = [...categoryIdsIn, ...post.categories];
                const categoriesData = await repository_1.Repository.findAll(CategoriesEntity, {
                    id: (0, repository_1.In)(post.categories),
                    limit: 100
                }, [], {
                    select: ["id", "name", "slug", "description"]
                });
                post.categories = (categoriesData) ? categoriesData.data : [];
                post.featureImage = await this.mediasService.getImageUrl(post.featureImage, "webp", 1200, post.featureImageAlt, post.featureImageCaption);
            }
            const usersIn = [...new Set(userIdsIn)];
            const categoryIn = [...new Set(categoryIdsIn)];
            const authorsData = await repository_1.Repository.findAll(ProfilesEntity, {
                user: (0, repository_1.In)(usersIn),
                limit: 100
            }, [], {
                select: [
                    'id', 'user', 'name', 'slug', 'image', 'coverImage',
                    'bio', 'website', 'location', 'facebook', 'twitter', 'locale',
                    'visibility', 'metaTitle', 'metaDescription', 'lastSeen',
                    'commentNotifications', 'mentionNotifications', 'recommendationNotifications'
                ]
            });
            if (authorsData) {
                for (const author of authorsData.data) {
                    author.image = await this.mediasService.getImageUrl(author.image, "webp", 128, author.name, author.name);
                    author.coverImage = await this.mediasService.getImageUrl(author.coverImage, "webp", 1024, author.name, author.name);
                }
            }
            authors = (authorsData) ? authorsData.data : [];
            const categoriesData = await repository_1.Repository.findAll(CategoriesEntity, {
                id: (0, repository_1.In)(categoryIn),
                limit: 100
            }, [], {
                select: ["id", "name", "slug", "description"]
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
    async getAllPages(queries, req) {
        const PostsEntity = repository_1.Repository.getEntity("PostsEntity");
        const ProfilesEntity = repository_1.Repository.getEntity("ProfilesEntity");
        const posts = await repository_1.Repository.findAll(PostsEntity, {
            ...queries,
            type: "page"
        }, [], {
            select: [
                "id", "title", "slug", "content", "status", "autoPublishAt",
                "authors", "author", "categories", "featureImage", "publishedAt",
                "updatedAt", "createdAt"
            ]
        });
        let authors = [];
        if (posts) {
            let userIdsIn = [];
            for (const post of posts.data)
                userIdsIn.push(post.author);
            const usersIn = [...new Set(userIdsIn)];
            const authorsData = await repository_1.Repository.findAll(ProfilesEntity, {
                user: (0, repository_1.In)(usersIn),
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
    async getTags(queries) {
        const TagsEntity = repository_1.Repository.getEntity("TagsEntity");
        const tags = await repository_1.Repository.findAll(TagsEntity, {
            ...queries,
            limit: 100
        }, [], {
            select: ["id", "name", "slug", "description", "postCount"]
        });
        return (tags) ? JSON.stringify(tags.data) : [];
    }
    async savePost(data, user) {
        const PostsEntity = repository_1.Repository.getEntity("PostsEntity");
        const MetaEntity = repository_1.Repository.getEntity("MetaEntity");
        if (data.post.title.length < 3)
            throw new Error("The title must be at least 3 characters");
        if (data.post.title.length > 100)
            throw new Error("The title must be less than 100 characters");
        if (data.post.slug.length < 3)
            throw new Error("The slug must be at least 3 characters");
        if (data.post.slug.length > 100)
            throw new Error("The slug must be less than 100 characters");
        if (data.post && data.post.id && typeof data.post.id === "string") {
            if (data.post.meta)
                delete data.post.meta;
            if (data.post.authors) {
                const authors = [...data.post.authors];
                data.post.authors = [];
                for (const author of authors) {
                    data.post.authors.push(author.user);
                }
            }
            data.post.type = "post";
            const post = await repository_1.Repository.updateOne(PostsEntity, repository_1.Repository.queryBuilder({ id: data.post.id }), data.post);
            if (post) {
                await repository_1.Repository.updateOne(MetaEntity, {
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
            if (!data.post.authors || data.post.authors.length === 1)
                data.post.authors = [user.id];
            const post = await repository_1.Repository.insert(PostsEntity, data.post);
            if (post) {
                data.meta.post = post.data.id;
                await repository_1.Repository.insert(MetaEntity, data.meta);
            }
            await this.upsertTags(data.post.tags);
            await this.recalculateCategories();
            return post.data;
        }
    }
    async savePage(data, user) {
        const PostsEntity = repository_1.Repository.getEntity("PostsEntity");
        const MetaEntity = repository_1.Repository.getEntity("MetaEntity");
        if (data.post.title.length < 3)
            throw new Error("The title must be at least 3 characters");
        if (data.post.title.length > 100)
            throw new Error("The title must be less than 100 characters");
        if (data.post.slug.length < 3)
            throw new Error("The slug must be at least 3 characters");
        if (data.post.slug.length > 100)
            throw new Error("The slug must be less than 100 characters");
        if (data.post && data.post.id && typeof data.post.id === "string") {
            data.post.type = "page";
            const page = await repository_1.Repository.updateOne(PostsEntity, repository_1.Repository.queryBuilder({ id: data.post.id }), data.post);
            if (page) {
                await repository_1.Repository.updateOne(MetaEntity, {
                    post: data.post.id
                }, data.meta);
            }
            return { result: true };
        }
        else {
            data.post.author = user.id;
            data.post.authors = [user.id];
            data.post.type = "page";
            const page = await repository_1.Repository.insert(PostsEntity, data.post);
            console.log(page);
            if (page) {
                data.meta.post = page.data.id;
                await repository_1.Repository.insert(MetaEntity, data.meta);
            }
            return page.data;
        }
    }
    async getPostBySlug(slug) {
        const PostsEntity = repository_1.Repository.getEntity("PostsEntity");
        const post = await repository_1.Repository.findOne(PostsEntity, repository_1.Repository.queryBuilder({
            slug,
            type: "post",
            status: "published"
        }));
        if (!post)
            throw new Error("Post not found");
        return this.getPostById(post.id);
    }
    async getPageBySlug(slug) {
        const PostsEntity = repository_1.Repository.getEntity("PostsEntity");
        const page = await repository_1.Repository.findOne(PostsEntity, repository_1.Repository.queryBuilder({
            slug,
            type: "page",
            status: "published"
        }));
        if (!page)
            throw new Error("Page not found");
        return this.getPageById(page.id);
    }
    async getPostById(id) {
        const PostsEntity = repository_1.Repository.getEntity("PostsEntity");
        const ProfilesEntity = repository_1.Repository.getEntity("ProfilesEntity");
        const CategoriesEntity = repository_1.Repository.getEntity("CategoriesEntity");
        const MetaEntity = repository_1.Repository.getEntity("MetaEntity");
        const TagsEntity = repository_1.Repository.getEntity("TagsEntity");
        const post = await repository_1.Repository.findOne(PostsEntity, repository_1.Repository.queryBuilder({
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
        if (post) {
            post.featureImage = await this.mediasService.getImageUrl(post.featureImage, "webp", 1200, post.featureImageAlt, post.featureImageCaption);
            const meta = await repository_1.Repository.findOne(MetaEntity, repository_1.Repository.queryBuilder({
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
            const usersIn = [...new Set(userIdsIn)];
            const categoryIn = [...new Set(categoryIdsIn)];
            const authorsData = await repository_1.Repository.findAll(ProfilesEntity, {
                user: (0, repository_1.In)(usersIn),
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
            for (let key in post.authors) {
                post.authors[key].image = await this.mediasService.getImageUrl(post.authors[key].image, "webp", 128, post.authors[key].name, post.authors[key].name);
                post.authors[key].coverImage = await this.mediasService.getImageUrl(post.authors[key].coverImage, "webp", 1024, post.authors[key].name, post.authors[key].name);
            }
            const categoriesData = await repository_1.Repository.findAll(CategoriesEntity, {
                id: (0, repository_1.In)(categoryIn),
                limit: 100
            }, [], {
                select: ["id", "name", "slug", "description"]
            });
            post.categories = (categoriesData) ? categoriesData.data : [];
            const tagsData = await repository_1.Repository.findAll(TagsEntity, {
                name: (0, repository_1.In)(post.tags),
                limit: 100
            }, [], {
                select: ["id", "name", "slug", "description"]
            });
            post.tags = (tagsData) ? tagsData.data : [];
        }
        return JSON.stringify(post);
    }
    async getPageById(id) {
        const PostsEntity = repository_1.Repository.getEntity("PostsEntity");
        const ProfilesEntity = repository_1.Repository.getEntity("ProfilesEntity");
        const MetaEntity = repository_1.Repository.getEntity("MetaEntity");
        const page = await repository_1.Repository.findOne(PostsEntity, repository_1.Repository.queryBuilder({
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
        if (page) {
            page.featureImage = await this.mediasService.getImageUrl(page.featureImage, "webp", 1200, page.featureImageAlt, page.featureImageCaption);
            const meta = await repository_1.Repository.findOne(MetaEntity, repository_1.Repository.queryBuilder({
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
            const authorsData = await repository_1.Repository.findAll(ProfilesEntity, {
                user: (0, repository_1.In)(userIdsIn),
                limit: 100
            }, [], {
                select: [
                    'id', 'user', 'name', 'slug', 'image', 'coverImage',
                    'bio', 'website', 'location', 'facebook', 'twitter', 'instagram',
                    'linkedin', 'github', 'locale', 'visibility', 'metaTitle', 'metaDescription'
                ]
            });
            page.authors = (authorsData) ? authorsData.data : [];
            for (let key in page.authors) {
                page.authors[key].image = await this.mediasService.getImageUrl(page.authors[key].image, "webp", 128, page.authors[key].name, page.authors[key].name);
                page.authors[key].coverImage = await this.mediasService.getImageUrl(page.authors[key].coverImage, "webp", 1024, page.authors[key].name, page.authors[key].name);
            }
        }
        return JSON.stringify(page);
    }
    async getPostsByCategory(categoryId) {
        const PostsEntity = repository_1.Repository.getEntity("PostsEntity");
        const TagsEntity = repository_1.Repository.getEntity("TagsEntity");
        const posts = await repository_1.Repository.findAll(PostsEntity, {
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
        if (posts) {
            for (const post of posts.data) {
                post.featureImage = await this.mediasService.getImageUrl(post.featureImage, "webp", 1200);
                const tagsData = await repository_1.Repository.findAll(TagsEntity, {
                    name: (0, repository_1.In)(post.tags),
                    limit: 100
                }, [], {
                    select: ["id", "name", "slug", "description"]
                });
                post.tags = (tagsData) ? tagsData.data : [];
            }
        }
        return posts;
    }
    async getPostsByTagSlug(tagSlug) {
        const TagsEntity = repository_1.Repository.getEntity("TagsEntity");
        const tag = await repository_1.Repository.findOne(TagsEntity, { slug: tagSlug }, {
            select: ["id", "name"]
        });
        if (!tag)
            throw new Error("Tag not found");
        return this.getPostsByTag(tag.name);
    }
    async getPostsByTag(tagName) {
        const PostsEntity = repository_1.Repository.getEntity("PostsEntity");
        const TagsEntity = repository_1.Repository.getEntity("TagsEntity");
        const tag = await repository_1.Repository.findOne(TagsEntity, { name: tagName }, {
            select: ["id", "name", "slug", "description", "postCount"]
        });
        const posts = await repository_1.Repository.findAll(PostsEntity, {
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
        if (posts) {
            for (const post of posts.data) {
                post.featureImage = await this.mediasService.getImageUrl(post.featureImage, "webp", 1200);
                const tagsData = await repository_1.Repository.findAll(TagsEntity, {
                    name: (0, repository_1.In)(post.tags),
                    limit: 100
                }, [], {
                    select: ["id", "name", "slug", "description"]
                });
                post.tags = (tagsData) ? tagsData.data : [];
            }
        }
        return { posts: posts ? posts.data : [], tag };
    }
    async upsertTags(tags) {
        const TagsEntity = repository_1.Repository.getEntity("TagsEntity");
        for (const tag of tags) {
            const tagStoraged = await repository_1.Repository.findOne(TagsEntity, { slug: tag });
            if (tagStoraged)
                continue;
            await repository_1.Repository.insert(TagsEntity, { name: tag, slug: (0, extra_utils_1.slugify)(tag) });
        }
        await this.recalculateTags();
    }
    async recalculateTags() {
        const TagsEntity = repository_1.Repository.getEntity("TagsEntity");
        const PostsEntity = repository_1.Repository.getEntity("PostsEntity");
        const tags = await repository_1.Repository.findAll(TagsEntity, {
            limit: 1000
        });
        if (tags) {
            for (const tag of tags.data) {
                const postCount = await repository_1.Repository.findAll(PostsEntity, {
                    limit: 10000,
                    searchField: 'tags',
                    search: tag.name
                }, [], {
                    select: ["id"]
                });
                if (postCount) {
                    await repository_1.Repository.updateOne(TagsEntity, { id: tag.id }, {
                        postCount: postCount.data.length
                    });
                }
            }
        }
    }
    async recalculateCategories() {
        const CategoriesEntity = repository_1.Repository.getEntity("CategoriesEntity");
        const PostsEntity = repository_1.Repository.getEntity("PostsEntity");
        const categories = await repository_1.Repository.findAll(CategoriesEntity, {
            limit: 1000
        });
        if (categories) {
            for (const category of categories.data) {
                const postCount = await repository_1.Repository.findAll(PostsEntity, {
                    limit: 10000,
                    searchField: 'categories',
                    search: category.id
                }, [], {
                    select: ["id"]
                });
                if (postCount) {
                    await repository_1.Repository.updateOne(CategoriesEntity, { id: category.id }, {
                        postCount: postCount.data.length
                    });
                }
            }
        }
    }
};
exports.PostsPublicService = PostsPublicService;
exports.PostsPublicService = PostsPublicService = __decorate([
    (0, core_1.Service)('blog_posts_public'),
    __metadata("design:paramtypes", [medias_service_1.MediasService])
], PostsPublicService);
//# sourceMappingURL=posts.service.js.map
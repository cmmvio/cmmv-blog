import {
    Service,
} from "@cmmv/core";

import {
    Repository
} from "@cmmv/repository";

import {
    IPostMetadata,
    IDraftPost
} from "./posts.interface";

@Service('blog_posts_public')
export class PostsPublicService {
    async getTags() {
        const TagsEntity = Repository.getEntity("PostsTagsEntity");
        const tags = await Repository.findAll(TagsEntity, {}, [], {
            select: [ "id", "name", "slug", "description" ]
        });
        return (tags) ? JSON.stringify(tags.data) : [];
    }

    async draftPost(data: {
        post: IDraftPost,
        meta:  IPostMetadata
    }) {
        const PostsEntity = Repository.getEntity("PostsEntity");

        if(data.post.title.length < 3)
            throw new Error("The title must be at least 3 characters");

        if(data.post.title.length > 100)
            throw new Error("The title must be less than 100 characters");

        if(data.post.slug.length < 3)
            throw new Error("The slug must be at least 3 characters");

        if(data.post.slug.length > 100)
            throw new Error("The slug must be less than 100 characters");

        if(data.post.id) {
            const post = await Repository.update(PostsEntity, data.post.id, data.post);
            return post;
        }
        else {
            const post = await Repository.insert(PostsEntity, data.post);
            return post;
        }
    }


}

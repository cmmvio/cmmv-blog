import * as crypto from "crypto";

import {
    Service
} from "@cmmv/core";

import {
    Repository, In
} from "@cmmv/repository";

import {
    MediasService
} from "../medias/medias.service";

@Service('blog_authors')
export class AuthorsService {
    constructor(
        private readonly mediasService: MediasService
    ){}

    /**
     * Get all authors
     * @param queries - Queries
     * @returns - Authors
     */
    async getAll(queries?: any) {
        const ProfilesEntity = Repository.getEntity("ProfilesEntity");

        const authors = await Repository.findAll(ProfilesEntity, queries, [], {
            select: [
                'id', 'user', 'name', 'slug', 'image', 'coverImage',
                'bio', 'website', 'location', 'facebook', 'twitter', 'locale',
                'visibility', 'metaTitle', 'metaDescription', 'lastSeen',
                'commentNotifications', 'mentionNotifications', 'recommendationNotifications'
            ]
        });

        let authorsData = [];

        if(authors){
            let userIdsIn = [];

            for(let author of authors.data){
                if(author.user)
                    userIdsIn.push(author.user);
            }

            const UserEntity = Repository.getEntity("UserEntity");
            const users = await Repository.findAll(UserEntity, {
                id: In(userIdsIn)
            }, [], {
                select: ['id', 'blocked', 'email', 'groups', 'root', 'validated']
            });

            if(users){
                for(let author of authors.data){
                    const user = users.data.find((user: any) => user.id === author.user);

                    if(user)
                        authorsData.push({...author, ...user});
                }

                authors.data = authorsData;
            }
        }

        return authors;
    }

    /**
     * Get an author by id
     * @param id - Id
     * @returns - Author
     */
    async getAuthorById(id: string) {
        const ProfilesEntity = Repository.getEntity("ProfilesEntity");

        const author = await Repository.findOne(ProfilesEntity, { id }, {
            select: [
                'id', 'user', 'name', 'slug', 'image', 'coverImage',
                'bio', 'website', 'location', 'facebook', 'twitter', 'instagram',
                'linkedin', 'github', 'locale', 'visibility', 'metaTitle', 'metaDescription'
            ]
        });

        if(author.visibility !== 'public')
            return null;

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

        return author;
    }

    /**
     * Get an author by slug
     * @param slug - Slug
     * @returns - Author
     */
    async getAuthorBySlug(slug: string) {
        const ProfilesEntity = Repository.getEntity("ProfilesEntity");

        const author = await Repository.findOne(ProfilesEntity, { slug }, {
            select: [
                'id', 'user', 'name', 'slug', 'image', 'coverImage',
                'bio', 'website', 'location', 'facebook', 'twitter', 'instagram',
                'linkedin', 'github', 'locale', 'visibility', 'metaTitle', 'metaDescription'
            ]
        });

        if(author.visibility !== 'public')
            return null;

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

        return author;
    }

    /**
     * Create an author
     * @param data - Author data
     * @returns - Author
     */
    async createAuthor(data: any) {
        const ProfilesEntity = Repository.getEntity("ProfilesEntity");
        const UserEntity = Repository.getEntity("UserEntity");

        const user = await Repository.findOne(UserEntity, { email: data.email });

        if(user)
            throw new Error("User already exists");

        const usernameHashed = crypto
            .createHash('sha1')
            .update(data.email)
            .digest('hex');

        const passwordHashed = crypto
            .createHash('sha256')
            .update(new Date().getTime().toString())
            .digest('hex');

        const userData = {
            username: usernameHashed,
            email: data.email,
            password: passwordHashed,
            root: false,
            validated: false
        };

        const newUser = await Repository.insert(UserEntity, userData);

        if(!newUser)
            throw new Error("User not created");

        const authorData = {
            user: newUser.data.id,
            name: data.name,
            slug: data.slug,
            bio: data.bio,
            website: data.website,
            location: data.location,
            facebook: data.facebook,
            twitter: data.twitter,
            locale: data.locale,
            visibility: data.visibility,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            commentNotifications: data.commentNotifications,
            mentionNotifications: data.mentionNotifications,
            recommendationNotifications: data.recommendationNotifications,
            emailDisabled: data.emailDisabled
        };

        const author = await Repository.insert(ProfilesEntity, authorData);

        return author;
    }

    /**
     * Update an author
     * @param id - Id
     * @param data - Author data
     * @returns - Author
     */
    async updateAuthor(id: string, data: { [key: string]: any }) {
        const ProfilesEntity = Repository.getEntity("ProfilesEntity");
        const ignoredKeys = ['email', 'createdAt', 'updatedAt', 'getLocation', 'note', 'emailDisabled'];

        const updateData: any = {};

        for(let key in data){
            if(!ignoredKeys.includes(key))
                updateData[key] = data[key];
        }

        const result = await Repository.updateOne(
            ProfilesEntity,
            Repository.queryBuilder({ user: id }),
            updateData
        );

        if(!result)
            throw new Error("Author not updated");

        return { message: "Author updated" };
    }

    /**
     * Delete an author
     * @param id - Id
     * @returns - Author
     */
    async deleteAuthor(id: string) {
        const ProfilesEntity = Repository.getEntity("ProfilesEntity");
        const result = await Repository.delete(ProfilesEntity, { id });

        if(!result)
            throw new Error("Author not deleted");

        return { message: "Author deleted" };
    }
}


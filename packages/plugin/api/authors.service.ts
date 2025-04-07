import * as crypto from "crypto";

import {
    Service
} from "@cmmv/core";

import {
    Repository, In
} from "@cmmv/repository";

@Service('blog_authors')
export class AuthorsService {
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
}


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
exports.AuthorsService = void 0;
const crypto = require("crypto");
const core_1 = require("@cmmv/core");
const repository_1 = require("@cmmv/repository");
const medias_service_1 = require("../medias/medias.service");
let AuthorsService = class AuthorsService {
    mediasService;
    constructor(mediasService) {
        this.mediasService = mediasService;
    }
    async getAll(queries) {
        const ProfilesEntity = repository_1.Repository.getEntity("ProfilesEntity");
        const authors = await repository_1.Repository.findAll(ProfilesEntity, queries, [], {
            select: [
                'id', 'user', 'name', 'slug', 'image', 'coverImage',
                'bio', 'website', 'location', 'facebook', 'twitter', 'locale',
                'visibility', 'metaTitle', 'metaDescription', 'lastSeen',
                'commentNotifications', 'mentionNotifications', 'recommendationNotifications'
            ]
        });
        let authorsData = [];
        if (authors) {
            let userIdsIn = [];
            for (let author of authors.data) {
                if (author.user)
                    userIdsIn.push(author.user);
            }
            const UserEntity = repository_1.Repository.getEntity("UserEntity");
            const users = await repository_1.Repository.findAll(UserEntity, {
                id: (0, repository_1.In)(userIdsIn)
            }, [], {
                select: ['id', 'blocked', 'email', 'groups', 'root', 'validated']
            });
            if (users) {
                for (let author of authors.data) {
                    const user = users.data.find((user) => user.id === author.user);
                    if (user)
                        authorsData.push({ ...author, ...user });
                }
                authors.data = authorsData;
            }
        }
        return authors;
    }
    async getAuthorById(id) {
        const ProfilesEntity = repository_1.Repository.getEntity("ProfilesEntity");
        const author = await repository_1.Repository.findOne(ProfilesEntity, { id }, {
            select: [
                'id', 'user', 'name', 'slug', 'image', 'coverImage',
                'bio', 'website', 'location', 'facebook', 'twitter', 'instagram',
                'linkedin', 'github', 'locale', 'visibility', 'metaTitle', 'metaDescription'
            ]
        });
        if (author.visibility !== 'public')
            return null;
        author.image = await this.mediasService.getImageUrl(author.image, "webp", 128, author.name, author.name);
        author.coverImage = await this.mediasService.getImageUrl(author.coverImage, "webp", 1024, author.name, author.name);
        return author;
    }
    async getAuthorBySlug(slug) {
        const ProfilesEntity = repository_1.Repository.getEntity("ProfilesEntity");
        const author = await repository_1.Repository.findOne(ProfilesEntity, { slug }, {
            select: [
                'id', 'user', 'name', 'slug', 'image', 'coverImage',
                'bio', 'website', 'location', 'facebook', 'twitter', 'instagram',
                'linkedin', 'github', 'locale', 'visibility', 'metaTitle', 'metaDescription'
            ]
        });
        if (author.visibility !== 'public')
            return null;
        author.image = await this.mediasService.getImageUrl(author.image, "webp", 128, author.name, author.name);
        author.coverImage = await this.mediasService.getImageUrl(author.coverImage, "webp", 1024, author.name, author.name);
        return author;
    }
    async createAuthor(data) {
        const ProfilesEntity = repository_1.Repository.getEntity("ProfilesEntity");
        const UserEntity = repository_1.Repository.getEntity("UserEntity");
        const user = await repository_1.Repository.findOne(UserEntity, { email: data.email });
        if (user)
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
        const newUser = await repository_1.Repository.insert(UserEntity, userData);
        if (!newUser)
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
        const author = await repository_1.Repository.insert(ProfilesEntity, authorData);
        return author;
    }
    async updateAuthor(id, data) {
        const ProfilesEntity = repository_1.Repository.getEntity("ProfilesEntity");
        const ignoredKeys = ['email', 'createdAt', 'updatedAt', 'getLocation', 'note', 'emailDisabled'];
        const updateData = {};
        for (let key in data) {
            if (!ignoredKeys.includes(key))
                updateData[key] = data[key];
        }
        const result = await repository_1.Repository.updateOne(ProfilesEntity, repository_1.Repository.queryBuilder({ user: id }), updateData);
        if (!result)
            throw new Error("Author not updated");
        return { message: "Author updated" };
    }
    async deleteAuthor(id) {
        const ProfilesEntity = repository_1.Repository.getEntity("ProfilesEntity");
        const result = await repository_1.Repository.delete(ProfilesEntity, { id });
        if (!result)
            throw new Error("Author not deleted");
        return { message: "Author deleted" };
    }
};
exports.AuthorsService = AuthorsService;
exports.AuthorsService = AuthorsService = __decorate([
    (0, core_1.Service)('blog_authors'),
    __metadata("design:paramtypes", [medias_service_1.MediasService])
], AuthorsService);
//# sourceMappingURL=authors.service.js.map
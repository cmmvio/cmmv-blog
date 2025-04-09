"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogProfileService = void 0;
const core_1 = require("@cmmv/core");
const repository_1 = require("@cmmv/repository");
let BlogProfileService = class BlogProfileService extends core_1.AbstractService {
    async getProfile(user) {
        const UserEntity = repository_1.Repository.getEntity("UserEntity");
        const userData = await repository_1.Repository.findOne(UserEntity, { id: user.id, blocked: false });
        if (!userData)
            throw new Error("User not found");
        const ProfilesEntity = repository_1.Repository.getEntity("ProfilesEntity");
        const profile = await repository_1.Repository.findOne(ProfilesEntity, { user: user.id }, {
            select: [
                "id", "name", "slug", "image", "coverImage", "bio",
                "website", "location", "facebook", "twitter", "instagram", "linkedin", "github",
                "locale", "visibility", "metaTitle", "metaDescription", "lastSeen",
                "commentNotifications", "mentionNotifications", "recommendationNotifications"
            ]
        });
        return {
            ...user,
            email: userData.email,
            profile: profile ? profile : {}
        };
    }
    async updateProfile(user, profile) {
        const UserEntity = repository_1.Repository.getEntity("UserEntity");
        const userData = await repository_1.Repository.findOne(UserEntity, { id: user.id, blocked: false });
        if (!userData)
            throw new Error("User not found");
        const ProfilesEntity = repository_1.Repository.getEntity("ProfilesEntity");
        const profileData = await repository_1.Repository.findOne(ProfilesEntity, { user: user.id });
        if (profileData) {
            profileData.name = profile.name;
            profileData.slug = profile.slug;
            profileData.image = profile.image;
            profileData.coverImage = profile.coverImage;
            profileData.bio = profile.bio;
            profileData.website = profile.website;
            profileData.location = profile.location;
            profileData.facebook = profile.facebook;
            profileData.twitter = profile.twitter;
            profileData.instagram = profile.instagram;
            profileData.linkedin = profile.linkedin;
            profileData.github = profile.github;
            profileData.locale = profile.locale;
            profileData.visibility = profile.visibility;
            profileData.metaTitle = profile.metaTitle;
            profileData.metaDescription = profile.metaDescription;
            profileData.commentNotifications = profile.commentNotifications;
            profileData.mentionNotifications = profile.mentionNotifications;
            profileData.recommendationNotifications = profile.recommendationNotifications;
            await repository_1.Repository.updateById(ProfilesEntity, profileData.id, profileData);
        }
        else {
            let newProfileData = new ProfilesEntity();
            newProfileData.user = user.id;
            newProfileData.name = profile.name;
            newProfileData.slug = profile.slug;
            newProfileData.image = profile.image;
            newProfileData.coverImage = profile.coverImage;
            newProfileData.bio = profile.bio;
            newProfileData.website = profile.website;
            newProfileData.location = profile.location;
            newProfileData.facebook = profile.facebook;
            newProfileData.twitter = profile.twitter;
            newProfileData.instagram = profile.instagram;
            newProfileData.linkedin = profile.linkedin;
            newProfileData.github = profile.github;
            newProfileData.locale = profile.locale;
            newProfileData.visibility = profile.visibility;
            newProfileData.metaTitle = profile.metaTitle;
            newProfileData.metaDescription = profile.metaDescription;
            await repository_1.Repository.insert(ProfilesEntity, newProfileData);
        }
        return {
            success: true,
            message: "Profile updated successfully"
        };
    }
};
exports.BlogProfileService = BlogProfileService;
exports.BlogProfileService = BlogProfileService = __decorate([
    (0, core_1.Service)("blog_profile")
], BlogProfileService);
//# sourceMappingURL=profile.service.js.map
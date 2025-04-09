"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModule = void 0;
const core_1 = require("@cmmv/core");
const authors_module_1 = require("./authors/authors.module");
const posts_module_1 = require("./posts/posts.module");
const categories_modules_1 = require("./categories/categories.modules");
const comments_module_1 = require("./comments/comments.module");
const members_module_1 = require("./members/members.module");
const settings_module_1 = require("./settings/settings.module");
const profile_module_1 = require("./profile/profile.module");
const medias_module_1 = require("./medias/medias.module");
const sitemap_module_1 = require("./sitemap/sitemap.module");
const analytics_module_1 = require("./analytics/analytics.module");
exports.BlogModule = new core_1.Module('blog', {
    submodules: [
        authors_module_1.AuthorsModule,
        posts_module_1.PostsModule,
        categories_modules_1.CategoriesModule,
        comments_module_1.CommentsModule,
        members_module_1.MembersModule,
        settings_module_1.BlogSettingsModule,
        profile_module_1.ProfileModule,
        medias_module_1.MediasModule,
        sitemap_module_1.SitemapModule,
        analytics_module_1.AnalyticsModule
    ]
});
//# sourceMappingURL=blog.module.js.map
import {
    Service,
} from "@cmmv/core";

import {
    Repository
} from "@cmmv/repository";

@Service('blog_redirects')
export class RedirectsService {

    /**
     * Get redirect
     * @param slug
     * @returns
     */
    async getRedirect(slug: string) {
        const RedirectsEntity = Repository.getEntity("RedirectsEntity");
        const redirect = await Repository.findOne(RedirectsEntity, {
            oldSlug: slug
        }, {
            select: ["redirectUrl", "codeStatus"]
        });

        if (!redirect)
            throw new Error("Redirect not found");

        return redirect;
    }

    /**
     * Get redirect by referer
     * @param refererId
     * @returns
     */
    async getRedirectByReferer(refererId: string) {
        const RedirectsEntity = Repository.getEntity("RedirectsEntity");
        const redirect = await Repository.findOne(RedirectsEntity, {
            refererId: refererId
        }, {
            select: ["redirectUrl", "codeStatus"]
        });

        if (!redirect)
            throw new Error("Redirect not found");

        return redirect;
    }
}

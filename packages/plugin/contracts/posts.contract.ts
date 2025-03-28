import { Contract } from "@cmmv/core";

@Contract({
    namespace: 'Blog',
    controllerName: 'Posts',
    protoPackage: 'blog',
    subPath: '/blog',
    generateController: true,
    generateBoilerplates: false,
    auth: true,
})
export class PostsContract {

}

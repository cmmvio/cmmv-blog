import { Module } from '@cmmv/core';

import { AuthorsController } from "./authors.controller";
import { AuthorsService } from "./authors.service";

export const AuthorsModule = new Module('blog_authors', {
    controllers: [AuthorsController],
    providers: [AuthorsService]
});

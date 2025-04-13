import { Module } from '@cmmv/core';

import { RedirectsContract } from "../../contracts/redirects.contract";
import { RedirectsController } from "./redirects.controller";
import { RedirectsService } from "./redirects.service";

export const RedirectsModule = new Module('blog_redirects', {
    controllers: [RedirectsController],
    providers: [RedirectsService],
    contracts: [RedirectsContract]
});

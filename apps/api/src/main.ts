import "./config";

import { Application } from "@cmmv/core";
import { AuthModule } from "@cmmv/auth";
import { DefaultAdapter, DefaultHTTPModule } from "@cmmv/http";
import { RepositoryModule, Repository } from "@cmmv/repository";
import { BlogModule } from "@cmmv/blog/api";
import { ApiPublicModule } from "./modules/public.module";

Application.create({
    httpAdapter: DefaultAdapter,
    modules: [
        DefaultHTTPModule,
        RepositoryModule,
        AuthModule,
        ApiPublicModule,
        BlogModule
    ],
    providers: [Repository]
});

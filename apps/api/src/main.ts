import "./config";

import { Application } from "@cmmv/core";
import { AuthModule } from "@cmmv/auth";
import { DefaultAdapter, DefaultHTTPModule } from "@cmmv/http";
import { RepositoryModule, Repository } from "@cmmv/repository";
import { BlogModule } from "@cmmv/blog/api";

Application.create({
    httpAdapter: DefaultAdapter,
    modules: [
        DefaultHTTPModule,
        RepositoryModule,
        AuthModule,
        BlogModule
    ],
    providers: [Repository]
});

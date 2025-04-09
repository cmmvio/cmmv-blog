import "./config";

import { Application } from "@cmmv/core";
import { AuthModule } from "@cmmv/auth";
import { DefaultAdapter, DefaultHTTPModule } from "@cmmv/http";
import { RepositoryModule, Repository } from "@cmmv/repository";
//import { SandboxModule } from "@cmmv/sandbox";
import { BlogModule } from "@cmmv/blog/api/blog.module";

Application.create({
    httpAdapter: DefaultAdapter,
    modules: [
        DefaultHTTPModule,
        RepositoryModule,
        AuthModule,
        //SandboxModule,
        BlogModule
    ],
    providers: [Repository]
});

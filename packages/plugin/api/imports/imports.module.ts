import { Module } from '@cmmv/core';

import { ImportController } from './imports.controller';
import { ImportService } from "./imports.service";

export const ImportsModule = new Module('blog_imports', {
    controllers: [ImportController],
    providers: [ImportService]
});

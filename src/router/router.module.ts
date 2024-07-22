import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { RoutesUserModule } from 'src/router/routes/routes.user.module';
import { RoutesPublicModule } from 'src/router/routes/routes.public.module';
import { RoutesPrivateModule } from 'src/router/routes/routes.private.module';
import { RoutesAdminModule } from 'src/router/routes/routes.admin.module';
import { RoutesAuthModule } from 'src/router/routes/routes.auth.module';

@Module({})
export class RouterModule {
    static forRoot(): DynamicModule {
        const imports: (
            | DynamicModule
            | Type<any>
            | Promise<DynamicModule>
            | ForwardReference<any>
        )[] = [];

        if (process.env.HTTP_ENABLE === 'true') {
            imports.push(
                RoutesPublicModule,
                RoutesPrivateModule,
                RoutesUserModule,
                RoutesAdminModule,
                RoutesAuthModule,
                NestJsRouterModule.register([
                    {
                        path: '/public',
                        module: RoutesPublicModule,
                    },
                    {
                        path: '/private',
                        module: RoutesPrivateModule,
                    },
                    {
                        path: '/admin',
                        module: RoutesAdminModule,
                    },
                    {
                        path: '/user',
                        module: RoutesUserModule,
                    },
                    {
                        path: '/auth',
                        module: RoutesAuthModule,
                    },
                ])
            );
        }

        return {
            module: RouterModule,
            providers: [],
            exports: [],
            controllers: [],
            imports,
        };
    }
}

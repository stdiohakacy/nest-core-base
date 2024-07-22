import {
    LogLevel,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import {
    ThrottlerGuard,
    ThrottlerModule,
    ThrottlerModuleOptions,
} from '@nestjs/throttler';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';
import { AppGeneralFilter } from 'src/app/filters/app.general.filter';
import { AppHttpFilter } from 'src/app/filters/app.http.filter';
import { AppValidationImportFilter } from 'src/app/filters/app.validation-import.filter';
import { AppValidationFilter } from 'src/app/filters/app.validation.filter';
import {
    JsonBodyParserMiddleware,
    RawBodyParserMiddleware,
    TextBodyParserMiddleware,
    UrlencodedBodyParserMiddleware,
} from 'src/app/middlewares/body-parser.middleware';
import { CorsMiddleware } from 'src/app/middlewares/cors.middleware';
import { MessageCustomLanguageMiddleware } from 'src/app/middlewares/custom-language.middleware';
import { HelmetMiddleware } from 'src/app/middlewares/helmet.middleware';
import { ResponseTimeMiddleware } from 'src/app/middlewares/response-time.middleware';
import { UrlVersionMiddleware } from 'src/app/middlewares/url-version.middleware';

@Module({
    controllers: [],
    exports: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_FILTER,
            useClass: AppGeneralFilter,
        },
        {
            provide: APP_FILTER,
            useClass: AppValidationFilter,
        },
        {
            provide: APP_FILTER,
            useClass: AppValidationImportFilter,
        },
        {
            provide: APP_FILTER,
            useClass: AppHttpFilter,
        },
    ],
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
                throttlers: [
                    {
                        ttl: config.get('middleware.throttle.ttl'),
                        limit: config.get('middleware.throttle.limit'),
                    },
                ],
            }),
        }),
        SentryModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                dsn: configService.get('debug.sentry.dsn'),
                debug: false,
                environment: configService.get<ENUM_APP_ENVIRONMENT>('app.env'),
                release: configService.get<string>('app.repoVersion'),
                logLevels: configService.get<LogLevel[]>(
                    'debug.sentry.logLevels.exception'
                ),
                close: {
                    enabled: true,
                    timeout: configService.get<number>('debug.sentry.timeout'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
})
export class AppMiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(
                HelmetMiddleware,
                JsonBodyParserMiddleware,
                TextBodyParserMiddleware,
                RawBodyParserMiddleware,
                UrlencodedBodyParserMiddleware,
                CorsMiddleware,
                UrlVersionMiddleware,
                ResponseTimeMiddleware,
                MessageCustomLanguageMiddleware
            )
            .forRoutes('*');
    }
}

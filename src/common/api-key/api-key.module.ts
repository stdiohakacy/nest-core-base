import { DynamicModule, Module } from '@nestjs/common';
import { ApiKeyXApiKeyStrategy } from 'src/common/api-key/guards/x-api-key/strategies/api-key.x-api-key.strategy';
import { ApiKeyRepositoryModule } from 'src/common/api-key/repository/api-key.repository.module';
import { ApiKeyService } from 'src/common/api-key/services/api-key.service';

@Module({
    providers: [ApiKeyService],
    exports: [ApiKeyService],
    controllers: [],
    imports: [ApiKeyRepositoryModule],
})
export class ApiKeyModule {
    static forRoot(): DynamicModule {
        return {
            module: ApiKeyModule,
            providers: [ApiKeyService, ApiKeyXApiKeyStrategy],
            exports: [],
            controllers: [],
            imports: [ApiKeyRepositoryModule],
        };
    }
}

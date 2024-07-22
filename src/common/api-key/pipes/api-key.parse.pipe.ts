import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { ENUM_API_KEY_STATUS_CODE_ERROR } from 'src/common/api-key/constants/api-key.status-code.constant';
import { ApiKeyDoc } from 'src/common/api-key/repository/entities/api-key.entity';
import { ApiKeyService } from 'src/common/api-key/services/api-key.service';

@Injectable()
export class ApiKeyParsePipe implements PipeTransform {
    constructor(private readonly apiKeyService: ApiKeyService) {}

    async transform(value: any): Promise<ApiKeyDoc> {
        const apiKey: ApiKeyDoc = await this.apiKeyService.findOneById(value);
        if (!apiKey) {
            throw new NotFoundException({
                statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.NOT_FOUND_ERROR,
                message: 'apiKey.error.notFound',
            });
        }

        return apiKey;
    }
}

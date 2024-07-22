import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { DatabaseIdResponseDto } from 'src/common/database/dtos/response/database.id.response.dto';
import { ENUM_USER_HISTORY_STATE } from 'src/modules/user/constants/user-history.enum.constant';

export class UserStateHistoryListResponseDto extends DatabaseIdResponseDto {
    @ApiProperty({
        required: true,
        example: faker.string.uuid(),
    })
    readonly user: string;

    @ApiProperty({
        required: true,
        enum: ENUM_USER_HISTORY_STATE,
        example: ENUM_USER_HISTORY_STATE.ACTIVE,
    })
    readonly beforeState: ENUM_USER_HISTORY_STATE;

    @ApiProperty({
        required: true,
        enum: ENUM_USER_HISTORY_STATE,
        example: ENUM_USER_HISTORY_STATE.ACTIVE,
    })
    readonly afterState: ENUM_USER_HISTORY_STATE;

    @ApiProperty({
        required: true,
        example: faker.string.uuid(),
    })
    readonly by: string;

    @ApiProperty({
        description: 'Date created at',
        example: faker.date.recent(),
        required: true,
        nullable: false,
    })
    readonly createdAt: Date;

    @ApiProperty({
        description: 'Date updated at',
        example: faker.date.recent(),
        required: true,
        nullable: false,
    })
    readonly updatedAt: Date;

    @ApiHideProperty()
    @Exclude()
    readonly deletedAt?: Date;
}

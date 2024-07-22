import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ENUM_AUTH_LOGIN_FROM } from 'src/common/auth/constants/auth.enum.constant';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_REQUEST_ACTION,
    ENUM_POLICY_ROLE_TYPE,
    ENUM_POLICY_SUBJECT,
} from 'src/common/policy/constants/policy.enum.constant';

export class AuthJwtAccessPayloadPermissionDto {
    @ApiProperty({
        required: true,
        enum: ENUM_POLICY_SUBJECT,
    })
    subject: ENUM_POLICY_SUBJECT;

    @ApiProperty({
        required: true,
        nullable: false,
    })
    @Transform(({ value }) => {
        return value
            .map((e: ENUM_POLICY_ACTION) => {
                switch (e) {
                    case ENUM_POLICY_ACTION.CREATE:
                        return ENUM_POLICY_REQUEST_ACTION.CREATE;
                    case ENUM_POLICY_ACTION.UPDATE:
                        return ENUM_POLICY_REQUEST_ACTION.UPDATE;
                    case ENUM_POLICY_ACTION.DELETE:
                        return ENUM_POLICY_REQUEST_ACTION.DELETE;
                    case ENUM_POLICY_ACTION.EXPORT:
                        return ENUM_POLICY_REQUEST_ACTION.EXPORT;
                    case ENUM_POLICY_ACTION.IMPORT:
                        return ENUM_POLICY_REQUEST_ACTION.IMPORT;
                    case ENUM_POLICY_ACTION.MANAGE:
                        return ENUM_POLICY_REQUEST_ACTION.MANAGE;
                    case ENUM_POLICY_ACTION.READ:
                    default:
                        return ENUM_POLICY_REQUEST_ACTION.READ;
                }
            })
            .join(',');
    })
    action: string;
}

export class AuthJwtAccessPayloadDto {
    @ApiProperty({
        required: true,
        nullable: false,
        example: faker.date.recent(),
    })
    readonly loginDate: Date;

    @ApiProperty({
        required: true,
        nullable: false,
        enum: ENUM_AUTH_LOGIN_FROM,
    })
    readonly loginFrom: ENUM_AUTH_LOGIN_FROM;

    @ApiProperty({
        required: true,
        nullable: false,
    })
    readonly _id: string;

    @ApiProperty({
        required: true,
        nullable: false,
    })
    readonly email: string;

    @ApiProperty({
        required: true,
        nullable: false,
    })
    readonly role: string;

    @ApiProperty({
        required: true,
        nullable: false,
        enum: ENUM_POLICY_ROLE_TYPE,
    })
    readonly type: ENUM_POLICY_ROLE_TYPE;

    @ApiProperty({
        required: true,
        nullable: false,
        type: AuthJwtAccessPayloadPermissionDto,
        isArray: true,
        default: [],
    })
    @Type(() => AuthJwtAccessPayloadPermissionDto)
    readonly permissions: AuthJwtAccessPayloadPermissionDto[];
}

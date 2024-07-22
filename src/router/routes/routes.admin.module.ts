import { Module } from '@nestjs/common';
import { ApiKeyModule } from 'src/common/api-key/api-key.module';
import { ApiKeyAdminController } from 'src/common/api-key/controllers/api-key.admin.controller';
import { AuthModule } from 'src/common/auth/auth.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { CountryAdminController } from 'src/modules/country/controllers/country.admin.controller';
import { CountryModule } from 'src/modules/country/country.module';
import { EmailModule } from 'src/modules/email/email.module';
import { RoleAdminController } from 'src/modules/role/controllers/role.admin.controller';
import { RoleModule } from 'src/modules/role/role.module';
import { SettingAdminController } from 'src/modules/setting/controllers/setting.admin.controller';
import { SettingModule } from 'src/modules/setting/setting.module';
import { UserAdminController } from 'src/modules/user/controllers/user.admin.controller';
import { UserModule } from 'src/modules/user/user.module';
@Module({
    controllers: [
        ApiKeyAdminController,
        SettingAdminController,
        RoleAdminController,
        UserAdminController,
        CountryAdminController,
    ],
    providers: [],
    exports: [],
    imports: [
        ApiKeyModule,
        PaginationModule,
        SettingModule,
        RoleModule,
        UserModule,
        AuthModule,
        EmailModule,
        CountryModule,
    ],
})
export class RoutesAdminModule {}

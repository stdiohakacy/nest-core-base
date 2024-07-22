import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';
import { IDatabaseService } from 'src/common/database/interfaces/database.service.interface';

@Injectable()
export class DatabaseService implements IDatabaseService {
    constructor(private readonly configService: ConfigService) {}

    createOptions(): MongooseModuleOptions {
        const env = this.configService.get<string>('app.env');

        const uri = this.configService.get<string>('database.uri');
        const debug = this.configService.get<boolean>('database.debug');

        const timeoutOptions = this.configService.get<Record<string, number>>(
            'database.timeoutOptions'
        );

        if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
            mongoose.set('debug', debug);
        }

        const mongooseOptions: MongooseModuleOptions = {
            uri,
            autoCreate: true,
            autoIndex: true,
            ...timeoutOptions,
        };

        return mongooseOptions;
    }
}

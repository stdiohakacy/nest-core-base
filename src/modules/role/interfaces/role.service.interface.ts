import {
    IDatabaseCreateManyOptions,
    IDatabaseCreateOptions,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseGetTotalOptions,
    IDatabaseManyOptions,
    IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { RoleCreateRequestDto } from 'src/modules/role/dtos/request/role.create.request.dto';
import { RoleUpdateRequestDto } from 'src/modules/role/dtos/request/role.update.request.dto';
import { RoleDoc } from 'src/modules/role/repository/entities/role.entity';

export interface IRoleService {
    findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<RoleDoc[]>;
    findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<RoleDoc>;
    findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<RoleDoc>;
    findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<RoleDoc>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
    existByName(
        name: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    create(
        { name, description, type, permissions }: RoleCreateRequestDto,
        options?: IDatabaseCreateOptions
    ): Promise<RoleDoc>;
    update(
        repository: RoleDoc,
        { permissions, type, description }: RoleUpdateRequestDto,
        options?: IDatabaseSaveOptions
    ): Promise<RoleDoc>;
    active(
        repository: RoleDoc,
        options?: IDatabaseSaveOptions
    ): Promise<RoleDoc>;
    inactive(
        repository: RoleDoc,
        options?: IDatabaseSaveOptions
    ): Promise<RoleDoc>;
    delete(
        repository: RoleDoc,
        options?: IDatabaseSaveOptions
    ): Promise<RoleDoc>;
    deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;
    createMany(
        data: RoleCreateRequestDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean>;
}

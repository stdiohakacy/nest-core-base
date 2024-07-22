import { Document } from 'mongoose';
import { IPaginationOrder } from 'src/common/pagination/interfaces/pagination.interface';

export interface IDatabaseQueryContainOptions {
    fullWord: boolean;
}

export interface IDatabaseJoin {
    field: string;
    localKey: string;
    foreignKey: string;
    model: any;
    condition?: Record<string, any>;
    justOne?: boolean;
    join?: this | this[];
}

export type IDatabaseDocument<T> = T & Document;

// find one
export interface IDatabaseFindOneOptions<T = any> {
    select?: Record<string, boolean | number> | string;
    join?: boolean | IDatabaseJoin | IDatabaseJoin[];
    session?: T;
    withDeleted?: boolean;
}

// find one lock
export type IDatabaseFindOneLockOptions<T = any> = IDatabaseFindOneOptions<T>;

export type IDatabaseGetTotalOptions<T = any> = Pick<
    IDatabaseFindOneOptions<T>,
    'session' | 'withDeleted' | 'join'
>;

export type IDatabaseSaveOptions<T = any> = Pick<
    IDatabaseFindOneOptions<T>,
    'session'
>;

// find
export interface IDatabaseFindAllPaginationPagingOptions {
    limit: number;
    offset: number;
}
export interface IDatabaseFindAllPaginationOptions {
    paging?: IDatabaseFindAllPaginationPagingOptions;
    order?: IPaginationOrder;
}

export interface IDatabaseFindAllOptions<T = any>
    extends IDatabaseFindAllPaginationOptions,
        IDatabaseFindOneOptions<T> {}

// create
export interface IDatabaseCreateOptions<T = any>
    extends Pick<IDatabaseFindOneOptions<T>, 'session'> {
    _id?: string;
}

// exist
export interface IDatabaseExistOptions<T = any>
    extends Pick<
        IDatabaseFindOneOptions<T>,
        'session' | 'withDeleted' | 'join'
    > {
    excludeId?: string[];
}

// bulk
export type IDatabaseManyOptions<T = any> = Pick<
    IDatabaseFindOneOptions<T>,
    'session' | 'join'
>;

export type IDatabaseCreateManyOptions<T = any> = Pick<
    IDatabaseFindOneOptions<T>,
    'session'
>;

export type IDatabaseSoftDeleteManyOptions<T = any> = IDatabaseManyOptions<T>;

export type IDatabaseRestoreManyOptions<T = any> = IDatabaseManyOptions<T>;

// Raw
export type IDatabaseRawOptions<T = any> = Pick<
    IDatabaseFindOneOptions<T>,
    'session' | 'withDeleted'
>;

export type IDatabaseRawFindAllOptions<T = any> = Pick<
    IDatabaseFindAllOptions<T>,
    'order' | 'paging' | 'session' | 'withDeleted'
>;

export type IDatabaseRawGetTotalOptions<T = any> = Pick<
    IDatabaseRawFindAllOptions<T>,
    'session' | 'withDeleted'
>;

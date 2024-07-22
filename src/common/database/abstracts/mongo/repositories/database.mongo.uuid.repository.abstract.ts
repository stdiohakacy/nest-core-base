import { UpdateQuery, UpdateWithAggregationPipeline } from 'mongoose';
import {
    ClientSession,
    Model,
    PipelineStage,
    PopulateOptions,
    Document,
} from 'mongoose';
import { DatabaseRepositoryAbstract } from 'src/common/database/abstracts/base/database.repository.abstract';
import { DATABASE_DELETED_AT_FIELD_NAME } from 'src/common/database/constants/database.constant';
import {
    IDatabaseCreateOptions,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseGetTotalOptions,
    IDatabaseCreateManyOptions,
    IDatabaseManyOptions,
    IDatabaseSoftDeleteManyOptions,
    IDatabaseRestoreManyOptions,
    IDatabaseRawOptions,
    IDatabaseSaveOptions,
    IDatabaseFindOneLockOptions,
    IDatabaseRawFindAllOptions,
    IDatabaseRawGetTotalOptions,
    IDatabaseJoin,
} from 'src/common/database/interfaces/database.interface';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export abstract class DatabaseMongoUUIDRepositoryAbstract<
    Entity,
    EntityDocument,
> extends DatabaseRepositoryAbstract<EntityDocument> {
    protected _repository: Model<Entity>;
    protected _joinOnFind?: IDatabaseJoin | IDatabaseJoin[];

    constructor(
        repository: Model<Entity>,
        options?: IDatabaseJoin | IDatabaseJoin[]
    ) {
        super();

        this._repository = repository;
        this._joinOnFind = options;
    }

    async findAll<T = EntityDocument>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions<ClientSession>
    ): Promise<T[]> {
        const findAll = this._repository.find<T>(find);

        if (!options?.withDeleted) {
            findAll.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
        }

        if (options?.select) {
            findAll.select(options.select);
        }

        if (options?.paging) {
            findAll.limit(options.paging.limit).skip(options.paging.offset);
        }

        if (options?.order) {
            findAll.sort(options.order);
        }

        if (options?.join) {
            findAll.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        if (options?.session) {
            findAll.session(options.session);
        }

        return findAll.exec();
    }

    async findAllDistinct<T = EntityDocument>(
        fieldDistinct: string,
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions<ClientSession>
    ): Promise<T[]> {
        const findAll = this._repository.distinct<string, T>(
            fieldDistinct,
            find
        );

        if (!options?.withDeleted) {
            findAll.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
        }

        if (options?.select) {
            findAll.select(options.select);
        }

        if (options?.paging) {
            findAll.limit(options.paging.limit).skip(options.paging.offset);
        }

        if (options?.order) {
            findAll.sort(options.order);
        }

        if (options?.join) {
            findAll.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        if (options?.session) {
            findAll.session(options.session);
        }

        return findAll.exec() as any;
    }
    async findOne<T = EntityDocument>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions<ClientSession>
    ): Promise<T> {
        const findOne = this._repository.findOne<T>(find);

        if (!options?.withDeleted) {
            findOne.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
        }

        if (options?.select) {
            findOne.select(options.select);
        }

        if (options?.join) {
            findOne.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        if (options?.session) {
            findOne.session(options.session);
        }

        return findOne.exec();
    }

    async findOneById<T = EntityDocument>(
        _id: string,
        options?: IDatabaseFindOneOptions<ClientSession>
    ): Promise<T> {
        const findOne = this._repository.findById<T>(_id);

        if (!options?.withDeleted) {
            findOne.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
        }

        if (options?.select) {
            findOne.select(options.select);
        }

        if (options?.join) {
            findOne.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        if (options?.session) {
            findOne.session(options.session);
        }

        return findOne.exec();
    }

    async findOneAndLock<T = EntityDocument>(
        find: Record<string, any>,
        options?: IDatabaseFindOneLockOptions<ClientSession>
    ): Promise<T> {
        const findOne = this._repository.findOneAndUpdate<T>(find, {
            new: true,
            useFindAndModify: false,
        });

        if (!options?.withDeleted) {
            findOne.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
        }

        if (options?.select) {
            findOne.select(options.select);
        }

        if (options?.join) {
            findOne.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        if (options?.session) {
            findOne.session(options.session);
        }

        return findOne.exec();
    }

    async findOneByIdAndLock<T = EntityDocument>(
        _id: string,
        options?: IDatabaseFindOneLockOptions<ClientSession>
    ): Promise<T> {
        const findOne = this._repository.findByIdAndUpdate<T>(_id, {
            new: true,
            useFindAndModify: false,
        });

        if (!options?.withDeleted) {
            findOne.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
        }

        if (options?.select) {
            findOne.select(options.select);
        }

        if (options?.join) {
            findOne.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        if (options?.session) {
            findOne.session(options.session);
        }

        return findOne.exec();
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions<ClientSession>
    ): Promise<number> {
        const count = this._repository.countDocuments(find);

        if (!options?.withDeleted) {
            count.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
        }

        if (options?.session) {
            count.session(options.session);
        }

        if (options?.join) {
            count.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        return count;
    }

    async exists(
        find: Record<string, any>,
        options?: IDatabaseExistOptions<ClientSession>
    ): Promise<boolean> {
        if (options?.excludeId) {
            find = {
                ...find,
                _id: {
                    $nin: options?.excludeId ?? [],
                },
            };
        }

        const exist = this._repository.exists(find);
        if (!options?.withDeleted) {
            exist.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
        }

        if (options?.session) {
            exist.session(options.session);
        }

        if (options?.join) {
            exist.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        const result = await exist;
        return result ? true : false;
    }

    async create<Dto = any>(
        data: Dto,
        options?: IDatabaseCreateOptions<ClientSession>
    ): Promise<EntityDocument> {
        const dataCreate: Record<string, any> = data;

        if (options?._id) {
            dataCreate._id = options._id;
        }

        const created = await this._repository.create([dataCreate], {
            session: options ? options.session : undefined,
        });

        return created[0] as EntityDocument;
    }

    async save(
        repository: EntityDocument & Document<string>,
        options?: IDatabaseSaveOptions
    ): Promise<EntityDocument> {
        return repository.save(options);
    }

    async delete(
        repository: EntityDocument & Document<string>,
        options?: IDatabaseSaveOptions
    ): Promise<EntityDocument> {
        return repository.deleteOne(options);
    }

    async softDelete(
        repository: EntityDocument & Document<string> & { deletedAt?: Date },
        options?: IDatabaseSaveOptions
    ): Promise<EntityDocument> {
        repository.deletedAt = new Date();
        return repository.save(options);
    }

    async restore(
        repository: EntityDocument & Document<string> & { deletedAt?: Date },
        options?: IDatabaseSaveOptions
    ): Promise<EntityDocument> {
        repository.deletedAt = undefined;
        return repository.save(options);
    }

    // bulk
    async createMany<Dto>(
        data: Dto[],
        options?: IDatabaseCreateManyOptions<ClientSession>
    ): Promise<boolean> {
        const create = this._repository.insertMany(data, {
            session: options ? options.session : undefined,
        });

        try {
            await create;
            return true;
        } catch (err: unknown) {
            throw err;
        }
    }

    async deleteManyByIds(
        _id: string[],
        options?: IDatabaseManyOptions<ClientSession>
    ): Promise<boolean> {
        const del = this._repository.deleteMany({
            _id: {
                $in: _id,
            } as any,
        });

        if (options?.session) {
            del.session(options.session);
        }

        if (options?.join) {
            del.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        try {
            await del;
            return true;
        } catch (err: unknown) {
            throw err;
        }
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions<ClientSession>
    ): Promise<boolean> {
        const del = this._repository.deleteMany(find);

        if (options?.session) {
            del.session(options.session);
        }

        if (options?.join) {
            del.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        try {
            await del;
            return true;
        } catch (err: unknown) {
            throw err;
        }
    }

    async softDeleteManyByIds(
        _id: string[],
        options?: IDatabaseSoftDeleteManyOptions<ClientSession>
    ): Promise<boolean> {
        const softDel = this._repository
            .updateMany(
                {
                    _id: {
                        $in: _id,
                    } as any,
                },
                {
                    $set: {
                        deletedAt: new Date(),
                    },
                }
            )
            .where(DATABASE_DELETED_AT_FIELD_NAME)
            .exists(false);

        if (options?.session) {
            softDel.session(options.session);
        }

        if (options?.join) {
            softDel.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        try {
            await softDel;
            return true;
        } catch (err: unknown) {
            throw err;
        }
    }

    async softDeleteMany(
        find: Record<string, any>,
        options?: IDatabaseSoftDeleteManyOptions<ClientSession>
    ): Promise<boolean> {
        const softDel = this._repository
            .updateMany(find, {
                $set: {
                    deletedAt: new Date(),
                },
            })
            .where(DATABASE_DELETED_AT_FIELD_NAME)
            .exists(false);

        if (options?.session) {
            softDel.session(options.session);
        }

        if (options?.join) {
            softDel.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        try {
            await softDel;
            return true;
        } catch (err: unknown) {
            throw err;
        }
    }

    async restoreManyByIds(
        _id: string[],
        options?: IDatabaseRestoreManyOptions<ClientSession>
    ): Promise<boolean> {
        const rest = this._repository
            .updateMany(
                {
                    _id: {
                        $in: _id,
                    } as any,
                },
                {
                    $set: {
                        deletedAt: undefined,
                    },
                }
            )
            .where(DATABASE_DELETED_AT_FIELD_NAME)
            .exists(true);

        if (options?.session) {
            rest.session(options.session);
        }

        if (options?.join) {
            rest.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        try {
            await rest;
            return true;
        } catch (err: unknown) {
            throw err;
        }
    }

    async restoreMany(
        find: Record<string, any>,
        options?: IDatabaseRestoreManyOptions<ClientSession>
    ): Promise<boolean> {
        const rest = this._repository
            .updateMany(find, {
                $set: {
                    deletedAt: undefined,
                },
            })
            .where(DATABASE_DELETED_AT_FIELD_NAME)
            .exists(true);

        if (options?.session) {
            rest.session(options.session);
        }

        if (options?.join) {
            rest.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        try {
            await rest;
            return true;
        } catch (err: unknown) {
            throw err;
        }
    }

    async updateMany<Dto>(
        find: Record<string, any>,
        data: Dto,
        options?: IDatabaseManyOptions<ClientSession>
    ): Promise<boolean> {
        const update = this._repository
            .updateMany(find, {
                $set: data,
            })
            .where(DATABASE_DELETED_AT_FIELD_NAME)
            .exists(false);

        if (options?.session) {
            update.session(options.session as ClientSession);
        }

        if (options?.join) {
            update.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        try {
            await update;
            return true;
        } catch (err: unknown) {
            throw err;
        }
    }

    async join<T = any>(
        repository: EntityDocument & Document<string>,
        joins: IDatabaseJoin | IDatabaseJoin[]
    ): Promise<T> {
        const cOptions = this._convertJoinOption(joins);

        return repository.populate(cOptions);
    }

    // raw
    async updateManyRaw(
        find: Record<string, any>,
        data: UpdateWithAggregationPipeline | UpdateQuery<Entity>,
        options?: IDatabaseManyOptions<ClientSession>
    ): Promise<boolean> {
        const update = this._repository
            .updateMany(find, data)
            .where(DATABASE_DELETED_AT_FIELD_NAME)
            .exists(false);

        if (options?.session) {
            update.session(options.session as ClientSession);
        }

        if (options?.join) {
            update.populate(
                typeof options.join === 'boolean'
                    ? this._convertJoinOption(this._joinOnFind)
                    : this._convertJoinOption(options.join)
            );
        }

        try {
            await update;
            return true;
        } catch (err: unknown) {
            throw err;
        }
    }

    async raw<RawResponse, RawQuery = PipelineStage[]>(
        rawOperation: RawQuery,
        options?: IDatabaseRawOptions
    ): Promise<RawResponse[]> {
        if (!Array.isArray(rawOperation)) {
            throw new Error('Must in array');
        }

        const pipeline: PipelineStage[] = rawOperation;

        if (!options?.withDeleted) {
            pipeline.push({
                $match: {
                    [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: false },
                },
            });
        }

        const aggregate = this._repository.aggregate<RawResponse>(pipeline);

        if (options?.session) {
            aggregate.session(options?.session);
        }

        return aggregate;
    }

    async rawFindAll<RawResponse, RawQuery = PipelineStage[]>(
        rawOperation: RawQuery,
        options?: IDatabaseRawFindAllOptions
    ): Promise<RawResponse[]> {
        if (!Array.isArray(rawOperation)) {
            throw new Error('Must in array');
        }

        const pipeline: PipelineStage[] = rawOperation;
        if (!options?.withDeleted) {
            pipeline.push({
                $match: {
                    [DATABASE_DELETED_AT_FIELD_NAME]: {
                        $exists: false,
                    },
                },
            });
        }

        if (options?.order) {
            const keysOrder = Object.keys(options?.order);
            pipeline.push({
                $sort: keysOrder.reduce(
                    (a, b) => ({
                        ...a,
                        [b]:
                            options?.order[b] ===
                            ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC
                                ? 1
                                : -1,
                    }),
                    {}
                ),
            });
        }

        if (options?.paging) {
            pipeline.push(
                {
                    $limit: options.paging.limit + options.paging.offset,
                },
                { $skip: options.paging.offset }
            );
        }

        const aggregate = this._repository.aggregate<RawResponse>(pipeline);

        if (options?.session) {
            aggregate.session(options?.session);
        }

        return aggregate;
    }

    async rawGetTotal<RawQuery = PipelineStage[]>(
        rawOperation: RawQuery,
        options?: IDatabaseRawGetTotalOptions
    ): Promise<number> {
        if (!Array.isArray(rawOperation)) {
            throw new Error('Must in array');
        }

        const pipeline: PipelineStage[] = rawOperation;
        pipeline.push({
            $group: {
                _id: null,
                count: { $sum: 1 },
            },
        });

        const aggregate = this._repository.aggregate(pipeline);

        if (options?.session) {
            aggregate.session(options?.session);
        }

        const raw = await aggregate;
        return raw && raw.length > 0 ? raw[0].count : 0;
    }

    async model(): Promise<Model<Entity>> {
        return this._repository;
    }

    private _convertJoinOption(
        options: IDatabaseJoin | IDatabaseJoin[]
    ): PopulateOptions | PopulateOptions[] {
        if (Array.isArray(options)) {
            const cOptions: PopulateOptions[] = options.map(e => {
                const aOptions: PopulateOptions = {
                    path: e.field,
                    foreignField: e.foreignKey,
                    localField: e.localKey,
                    model: e.model,
                    match: e.condition,
                };

                if (e.justOne) {
                    aOptions.justOne = true;
                    aOptions.perDocumentLimit = 1;
                }

                return aOptions;
            });

            return cOptions;
        }

        const cOptions: PopulateOptions = {
            path: options.field,
            foreignField: options.foreignKey,
            localField: options.localKey,
            model: options.model,
            match: options.condition,
        };

        if (options.justOne) {
            cOptions.justOne = true;
            cOptions.perDocumentLimit = 1;
        }

        return cOptions;
    }
}

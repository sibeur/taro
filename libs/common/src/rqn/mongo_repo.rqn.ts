import {
  IRQNRepository,
  RQNDataListParams,
  RQNDataParams,
  RQNFilterable,
  RQNPaginateResult,
} from './rqn.base';
import { Model } from 'mongoose';
import { MongoNotation } from './mongo_notation';
import { fromJSON } from '../helpers/entity.helper';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class MongooseRQNRepository<Entity, MongoSchemaModel>
  extends MongoNotation
  implements IRQNRepository<Entity>
{
  protected model: Model<MongoSchemaModel>;

  constructor(model: Model<MongoSchemaModel>) {
    super();
    this.model = model;
  }

  private handleMongoError(error) {
    if (error.code == 11000) {
      const [field] = Object.keys(error.keyPattern);
      error.message = `${field} duplicate`;
      throw new BadRequestException(error.message);
    }
  }

  async find(
    params: RQNDataListParams,
  ): Promise<Entity[] | RQNPaginateResult<Entity>> {
    const { filter, sort, select } = this.parseDataListParams(params);
    const paginate = await this.parsePaginate(
      params.paginate,
      filter,
      this.model,
    );
    let query = this.model
      .find(filter as object)
      .limit(paginate.perPage)
      .sort(sort);
    if (select) query = query.select(select);
    if (paginate.currentPage)
      query = query.skip((paginate.currentPage - 1) * paginate.perPage);
    if (!query) return null;
    const results = (await query).map((data) =>
      fromJSON<Entity>(data.toJSON()),
    );
    return paginate.currentPage ? { results, paginate } : results;
  }

  async findOneBy(params: RQNDataParams): Promise<Entity> {
    const filter = this.parseFilter(params.filter);
    const query = await this.model.findOne(filter as object);
    if (!query) return null;
    return fromJSON<Entity>(query.toJSON());
  }

  async findById(id: string): Promise<Entity> {
    if (id === '') throw new BadRequestException('ID cannot empty');
    const query = await this.model.findOne({ _id: id });
    if (!query) return null;
    return fromJSON<Entity>(query.toJSON());
  }

  async create(data: Entity): Promise<Entity> {
    try {
      const query = await this.model.create(data);
      return fromJSON<Entity>(query.toJSON());
    } catch (error) {
      this.handleMongoError(error);
      throw error;
    }
  }

  async updateById(id: string, data: Entity): Promise<boolean> {
    try {
      const query = await this.model.findOne({ _id: id });
      if (!query) throw new NotFoundException('Data Not Found');
      await this.model.updateOne({ _id: id }, data);
      return true;
    } catch (error) {
      this.handleMongoError(error);
      throw error;
    }
  }

  async destroyById(id: string): Promise<void> {
    const query = await this.model.findOne({ _id: id });
    if (!query) throw new NotFoundException('Data Not Found');
    await query.delete();
  }

  async destroyMany(filterParams: RQNFilterable): Promise<void> {
    const filter = this.parseFilter(filterParams);
    await this.model.deleteMany(filter as object);
  }
}

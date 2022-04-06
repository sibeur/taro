import { RQNPaginate } from '../rqn.base';
import { MongoFilterValue } from './filterable';
import { Model } from 'mongoose';
import rqn_config from '@core/common/configs/rqn_config';

export type MongoPaginate = {
  totalData?: number;
  totalPages?: number;
  perPage?: number;
  currentPage?: number;
};

export class MongoPaginateNotation<MongoSchemaModel> {
  private params: RQNPaginate;
  private filter: MongoFilterValue;
  private model: Model<MongoSchemaModel>;
  constructor(
    paginateParams: RQNPaginate,
    filter: MongoFilterValue,
    model: Model<MongoSchemaModel>,
  ) {
    this.params = paginateParams;
    if (!this.params) this.params = { limit: 0, page: null };
    if (!this.params?.limit) {
      this.params.limit = parseInt(rqn_config.default_limit);
    }
    this.filter = filter;
    this.model = model;
  }

  async parse(): Promise<MongoPaginate> {
    const perPage = this.params?.limit;
    if (!this.params?.page) return { perPage } as MongoPaginate;
    const currentPage = this.params?.page < 1 ? 1 : this.params?.page;
    const totalData = await this.model.countDocuments(this.filter as object);
    const totalPages = Math.ceil(totalData / this.params?.limit);
    return {
      currentPage,
      perPage,
      totalData,
      totalPages,
    };
  }
}

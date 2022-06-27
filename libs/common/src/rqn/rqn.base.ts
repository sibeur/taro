import { MongoPaginate } from './mongo_notation/paginateable';

export type RQNDataListParams = {
  filter?: RQNFilterable;
  sort?: RQNSortable;
  select?: RQNSelectable;
  paginate?: RQNPaginate;
};

export type RQNDataParams = {
  filter?: RQNFilterable;
  select?: RQNSelectable;
};

export type RQNFilterable = object;
export type RQNSortable = object;
export type RQNSelectable = string;
export type RQNPaginate = {
  page: number;
  limit: number;
};

export type RQNPaginateResult<Entity> = {
  results: Entity[];
  paginate: MongoPaginate;
};

export interface IRQNRepository<Entity> {
  find(
    params: RQNDataListParams,
  ): Promise<Entity[] | RQNPaginateResult<Entity>>;
  findOneBy(params: RQNDataParams): Promise<Entity>;
  findById(id: string): Promise<Entity>;
  create(data: Entity): Promise<Entity>;
  updateById(id: string, data: Entity): Promise<boolean>;
  destroyById(id: string): Promise<void>;
  destroyMany(filter: RQNFilterable): Promise<void>;
}

export interface IRQNService<Entity> {
  find(
    params: RQNDataListParams,
  ): Promise<Entity[] | RQNPaginateResult<Entity>>;
  findOneBy(params: RQNDataParams): Promise<Entity>;
  findById(id: string): Promise<Entity>;
  create(data: Entity): Promise<Entity>;
  updateById(id: string, data: Entity): Promise<boolean>;
  destroyById(id: string): Promise<void>;
  destroyMany(filter: RQNFilterable): Promise<void>;
}

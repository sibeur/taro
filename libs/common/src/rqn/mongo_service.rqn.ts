import {
  IRQNService,
  RQNDataListParams,
  RQNDataParams,
  RQNFilterable,
  RQNPaginateResult,
} from './rqn.base';
import { MongooseRQNRepository } from './mongo_repo.rqn';

export class MongooseRQNService<Entity, MongoSchemaModel>
  implements IRQNService<Entity>
{
  private repo: MongooseRQNRepository<Entity, MongoSchemaModel>;
  constructor(repo: MongooseRQNRepository<Entity, MongoSchemaModel>) {
    this.repo = repo;
  }
  find(
    params: RQNDataListParams,
  ): Promise<Entity[] | RQNPaginateResult<Entity>> {
    return this.repo.find(params);
  }
  findOneBy(params: RQNDataParams): Promise<Entity> {
    return this.repo.findOneBy(params);
  }
  findById(id: string): Promise<Entity> {
    return this.repo.findById(id);
  }
  create(data: Entity): Promise<Entity> {
    return this.repo.create(data);
  }
  updateById(id: string, data: Entity): Promise<boolean> {
    return this.repo.updateById(id, data);
  }
  async destroyById(id: string): Promise<void> {
    await this.repo.destroyById(id);
    return;
  }
  async destroyMany(filter: RQNFilterable): Promise<void> {
    await this.repo.destroyMany(filter);
    return;
  }
}

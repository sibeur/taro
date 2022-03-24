import {
  RQNFilterable,
  RQNSortable,
  RQNDataListParams,
  RQNSelectable,
  RQNPaginate,
} from '../rqn.base';
import { MongoFilterNotation, MongoFilterValue } from './filterable';
import { MongoPaginate, MongoPaginateNotation } from './paginateable';
import { MongoSelect, MongoSelectNotation } from './selectable';
import { MongoSortNotation, MongoSort } from './sortable';
import { Model } from 'mongoose';

export class MongoNotation {
  protected filterable: string[];
  protected sortable: string[];

  protected parseSort(sortParams: RQNSortable): MongoSort {
    return new MongoSortNotation(this.sortable, sortParams).parse();
  }

  protected parseFilter(filterParams: RQNFilterable): MongoFilterValue {
    return new MongoFilterNotation(this.filterable, filterParams).parse();
  }

  protected parseSelect(selectParams: RQNSelectable): MongoSelect {
    return new MongoSelectNotation(selectParams).parse();
  }

  protected async parsePaginate<MongoSchemaModel>(
    paginateParams: RQNPaginate,
    filter: MongoFilterValue,
    model: Model<MongoSchemaModel>,
  ): Promise<MongoPaginate> {
    return new MongoPaginateNotation(paginateParams, filter, model).parse();
  }

  protected parseDataListParams(params: RQNDataListParams): {
    filter: MongoFilterValue;
    sort: MongoSort;
    select: MongoSelect;
  } {
    const filter = this.parseFilter(params.filter);
    return {
      filter,
      sort: this.parseSort(params.sort),
      select: this.parseSelect(params.select),
    };
  }
}

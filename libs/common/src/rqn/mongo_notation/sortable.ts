import { RQNSortable } from '../rqn.base';

export enum MongoSortOptions {
  ASC = 1,
  DESC = -1,
}

export type MongoSort = object;

export class MongoSortNotation {
  private sortable: string[];
  private params: RQNSortable;
  constructor(sortable: string[], sortParams: RQNSortable) {
    this.sortable = sortable;
    this.params = sortParams;
  }

  private sortMapper(sortKey: string): MongoSort | null {
    if (!this.params[sortKey] || this.params[sortKey] == '') return null;
    const sort = this.params[sortKey] as string;
    switch (sort.toLowerCase()) {
      case 'asc':
        return { [sortKey]: MongoSortOptions.ASC };
      case 'desc':
        return { [sortKey]: MongoSortOptions.DESC };
      default:
        return null;
    }
  }

  parse(): MongoSort {
    if (!this.params) return {} as MongoSort;
    return this.sortable
      .map((sortKey) => this.sortMapper(sortKey))
      .filter((sort) => sort != null)
      .reduce((obj, item) => {
        const [key] = Object.keys(item);
        return Object.assign(obj, { [key]: item[key] });
      }, {});
  }
}

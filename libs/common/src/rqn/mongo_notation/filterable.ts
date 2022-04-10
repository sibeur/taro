import { RQNFilterable } from '../rqn.base';

export enum MongoFilterOperation {
  BETWEEN,
  EQUAL,
}

export type MongoFilterValue = object | string;

export class MongoFilter {
  field: string;
  operation: MongoFilterOperation;
  value: MongoFilterValue;

  constructor(field: string, opr: MongoFilterOperation, val: MongoFilterValue) {
    this.field = field;
    this.operation = opr;
    this.value = val;
  }

  toValue(): MongoFilterValue {
    return { [this.field]: this.value };
  }
}

export class MongoFilterParser {
  private filterStr: string;
  private field: string;
  constructor(field, filterStr: string) {
    this.field = field;
    this.filterStr = filterStr;
  }

  private parseBetween(result: MongoFilter): void {
    if (typeof this.filterStr == 'boolean') return;
    if (this.filterStr.search('<>') == -1) return;
    const betweenValueSplit = this.filterStr.split('<>');
    if (betweenValueSplit.length != 2)
      throw new Error('Between filter operator invalid.');

    const [bottomValue, topValue] = betweenValueSplit;
    result.field = this.field;
    result.operation = MongoFilterOperation.BETWEEN;
    result.value = {
      $gte: bottomValue,
      $lte: topValue,
    };

    return;
  }

  parse(): MongoFilter {
    const mf: MongoFilter | null = new MongoFilter(
      this.field,
      MongoFilterOperation.EQUAL,
      this.filterStr,
    );
    this.parseBetween(mf);
    return mf;
  }
}

export class MongoFilterNotation {
  private filterable: string[];
  private params: RQNFilterable;
  constructor(filterable: string[], filterParams: RQNFilterable) {
    this.filterable = filterable;
    this.params = filterParams;
  }

  private filterMapper(filterKey: string): MongoFilter | null {
    if (!this.params[filterKey] || this.params[filterKey] == '') return null;
    const filter = this.params[filterKey] as string;
    return new MongoFilterParser(filterKey, filter).parse();
  }

  parse(): MongoFilterValue {
    if (!this.params) return {} as MongoFilterValue;
    return this.filterable
      .map((sortKey) => this.filterMapper(sortKey)?.toValue())
      .filter((sort) => sort != null)
      .reduce((obj, item) => {
        const [key] = Object.keys(item);
        return Object.assign(obj, { [key]: item[key] });
      }, {});
  }
}

import { RQNSelectable } from '../rqn.base';

export type MongoSelect = string[];
export class MongoSelectNotation {
  private params: RQNSelectable;
  constructor(selectParams: RQNSelectable) {
    this.params = selectParams;
  }

  parse(): MongoSelect {
    if (!this.params) return null as MongoSelect;
    return this.params.split(',').map((e) => e.trim());
  }
}

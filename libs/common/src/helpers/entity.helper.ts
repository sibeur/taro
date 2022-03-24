export function fromJSON<T>(data: any): T {
  const entity = {} as T;
  for (const objKey of Object.keys(data)) {
    if (objKey === '_id') entity['id'] = data[objKey];
    else entity[objKey] = data[objKey];
  }
  return entity;
}

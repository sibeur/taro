import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { parse } from 'qs';

export const RQNParams = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const queryString = parse(req.query);
    return {
      filter: queryString.filter,
      sort: queryString.sort,
      select: queryString.select,
      paginate: {
        page: parseInt(queryString.page as string) || undefined,
        limit: parseInt(queryString.limit as string) || undefined,
      },
    };
  },
);

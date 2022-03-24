import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Storage } from '../typesAndInterface/storage';

@Injectable()
export class FileUploadGuard implements CanActivate {
  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest() as FastifyRequest;
    if (!req.isMultipart())
      throw new BadRequestException('multipart/form-data expected.');
    const file = await req.file();
    if (!file) throw new BadRequestException('file expected');
    const [exttype] = file.filename.split('.').reverse();
    req.incomingFile = {
      encoding: file.encoding,
      fieldname: file.fieldname,
      file: file.file,
      mimetype: file.mimetype,
      filename: file.filename,
      exttype,
    } as Storage.MultipartFile;
    return true;
  }
}

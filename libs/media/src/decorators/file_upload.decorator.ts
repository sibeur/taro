import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import mongoose from 'mongoose';
import { IUploadMedia } from '@core/media/typesAndInterface/media';
import { Readable } from 'stream';
import slugify from 'slugify';

const getStreamKiloByteSize = (
  readStream: NodeJS.ReadableStream,
): Promise<{ binary: Readable; size: number }> => {
  return new Promise((resolve, reject) => {
    let dataLength = 0;
    const data = [];

    readStream.on('data', (chunk) => {
      dataLength += chunk.length;
      data.push(chunk);
    });

    readStream.on('error', (err) => {
      reject(err);
    });

    readStream.on('end', () => {
      const binary = Readable.from(data);
      const size = dataLength / 1024;
      resolve({ binary, size });
    });
  });
};

export const FileUpload = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as FastifyRequest;
    const {
      file: fileStream,
      fieldname: ruleName,
      mimetype: mime,
      exttype: ext,
      filename: name,
    } = req.incomingFile;
    const { binary, size } = await getStreamKiloByteSize(fileStream);
    const randString = new mongoose.Types.ObjectId().toString();
    const [oriFileName] = name.split('.');
    const slugifyFileName = slugify(
      `${oriFileName.toLowerCase()}-${randString}`,
    );
    const randName = `${slugifyFileName}.${ext}`;
    const file: IUploadMedia = {
      ruleName,
      file: {
        randName,
        name,
        binary,
        ext,
        size,
        mime,
      },
    };
    return file;
  },
);

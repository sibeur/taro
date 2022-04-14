import { IsArray, IsNotEmpty } from 'class-validator';

export class MediaIdsDto {
  @IsNotEmpty()
  @IsArray()
  mediaIds: string[];
}

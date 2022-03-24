import { IsArray, IsNotEmpty } from 'class-validator';

export class CommitMediaDto {
  @IsNotEmpty()
  @IsArray()
  mediaIds: string[];
}

import { Optional } from '@nestjs/common';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AllowedMimes,
  MediaRuleOptions,
  MediaStorageOption,
  MediaValidationRule,
} from '../typesAndInterface/media_rule';

export class MutateMediaRuleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MediaRuleValidationDto)
  validations: MediaValidationRule;

  @Optional()
  @ValidateNested()
  @Type(() => MediaRuleOptionsDto)
  options: MediaRuleOptions;
}

export class MediaRuleValidationDto {
  @IsNumber()
  maxSize: number;

  @IsNotEmpty()
  @IsArray()
  @IsEnum(AllowedMimes, { each: true })
  allowedMimes: AllowedMimes[];
}

export class MediaRuleOptionsDto {
  @IsEnum(MediaStorageOption)
  @IsNotEmpty()
  storage: MediaStorageOption;

  @Optional()
  path: string;
}

import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TagType } from '../doubt-tag.enum';

export class CreateDoubtDto {
  @IsNotEmpty()
  @IsEnum(TagType)
  tags: TagType[];

  @IsString()
  @IsNotEmpty()
  asked_by: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  request_mentor: boolean;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  is_resolved: boolean;
}

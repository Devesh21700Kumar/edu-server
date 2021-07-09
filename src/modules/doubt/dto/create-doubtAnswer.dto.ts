import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDoubtAnswerDto {
  @IsString()
  @IsNotEmpty()
  answered_by: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

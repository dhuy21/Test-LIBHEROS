import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsString()
  @IsOptional()
  longDescription?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  longDescription?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string | null;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}

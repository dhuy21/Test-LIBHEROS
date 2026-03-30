import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskListDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

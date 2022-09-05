import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  contents?: string;
}

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ObjectiveDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
}

import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetTagDto {
  // @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit: number;

  // @IsOptional()
  @Type(() => Number)
  @IsInt()
  offset: number;
}

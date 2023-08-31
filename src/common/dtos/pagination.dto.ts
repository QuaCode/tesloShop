import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    example: 10,
    description: 'Limit',
  })
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    example: 5,
    description: 'Offset',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}

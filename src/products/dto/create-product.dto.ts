import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    example: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    nullable: false,
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiProperty({ example: 299 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 'Lorem ipsum dolor sit amet' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Lorem' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({ example: ['X', 'XL'] })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({ example: ['men', 'women'] })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({ example: ['https://example.com'] })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: 'men' })
  @IsIn(['men', 'woman', 'kid', 'unisex'])
  gender: string;
}

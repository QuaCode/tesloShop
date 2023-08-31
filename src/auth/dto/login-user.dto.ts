import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'email@email.com',
    description: 'Email',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password12#',
    description: 'Password',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;
}

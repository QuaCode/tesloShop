import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities';
import { UserRoleGuard } from './guards/user-role.guard';
import { Auth, GetUser, RoleProtected } from './decorators';
import { validRoles } from './interfaces';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth')
  @Auth()
  checkAuth(@GetUser() user: User) {
    return this.authService.checkAuth(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testPrivateRoute(@GetUser() user: User, @GetUser('email') userEmail: string) {
    return {
      ok: true,
      message: 'Hola mundo',
      user,
      userEmail,
    };
  }
  // @SetMetadata('roles', ['admin'])

  @Get('private2')
  @RoleProtected(validRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return user;
  }

  @Get('private3')
  @Auth(validRoles.superUser)
  privateRoute3() {
    return 'Hola mundo';
  }
}

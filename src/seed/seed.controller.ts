import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { validRoles } from 'src/auth/interfaces';
import { User } from '../auth/entities';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @Auth(validRoles.admin)
  executeSeed(@GetUser() user: User) {
    return this.seedService.runSeed(user);
  }
}

import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { validRoles } from 'src/auth/interfaces';
import { User } from '../auth/entities';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiBearerAuth()
  @Post()
  @Auth(validRoles.admin)
  executeSeed(@GetUser() user: User) {
    return this.seedService.runSeed(user);
  }
}

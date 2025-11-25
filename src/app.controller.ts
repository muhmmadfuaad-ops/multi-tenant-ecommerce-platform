import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
// import { User } from './interfaces/user.interface';
import type { User } from './prisma/generated/client';

@Controller()
export class AppController {
  constructor(
    // private readonly appService: AppService,
    private readonly prisma: PrismaService, // inject PrismaService here
  ) {}

  @Get('users')
  async getUsers(): Promise<User[]> {
    return await this.prisma.findAllUsers();
  }
}

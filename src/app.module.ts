import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [PrismaModule, UsersModule, ChatsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payments/payments.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ChatsModule,
    PaymentModule,
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigService available everywhere
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

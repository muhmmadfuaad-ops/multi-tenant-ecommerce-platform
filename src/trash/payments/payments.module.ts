import { Module } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { PaymentController } from './payments.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // To allow ConfigService inside PaymentService
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService], // Optional if other modules need it
})
export class PaymentModule {}

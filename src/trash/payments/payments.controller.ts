import { Controller, Post, Body, Res } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { Response } from 'express';
import { CreatePaymentDto, PaymentCallbackDto } from './dto/create-payment.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate a JazzCash payment (Server-to-Server)' })
  @ApiBody({ type: CreatePaymentDto })
  async initiate(@Body() body: CreatePaymentDto) {
    return this.paymentService.initiatePayment(
      body.amount,
      body.billReference,
      body.description,
    );
  }

  @Post('callback')
  @ApiOperation({ summary: 'JazzCash payment callback endpoint' })
  @ApiBody({ type: PaymentCallbackDto })
  handleCallback(@Body() body: PaymentCallbackDto) {
    // TODO: Verify secure hash, update DB
    console.log('JazzCash callback received:', body);
    return { status: 'ok' };
  }
}

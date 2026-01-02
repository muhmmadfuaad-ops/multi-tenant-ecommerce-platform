import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { SubmitPaymentDto } from './dto/submit-payment.dto';
import { CreateCustomerDto } from './create-customer.dto';
import type { Response } from 'express';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('authenticate')
  @ApiOperation({ summary: 'Authenticate with SafePay' })
  async authenticate(@Body() dto: AuthenticateDto) {
    return this.paymentsService.authenticate(dto.email, dto.password);
  }

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate a new payment tracker' })
  async initiatePayment(@Body() dto: InitiatePaymentDto) {
    return this.paymentsService.createTracker(dto);
  }

  @Post('create-customer')
  @ApiOperation({ summary: 'Create customer' })
  async createCustomer(@Body() dto: CreateCustomerDto) {
    return this.paymentsService.createCustomer(dto);
  }

  @Post('capture')
  @ApiOperation({ summary: 'Submit gateway action (transient token or equivalent)' })
  async capture(@Body() dto: SubmitPaymentDto) {
    return this.paymentsService.capture(dto);
  }

  @Get('redirect')
  @ApiOperation({ summary: 'Redirect the customer to Safepay Payment Page' })
  async redirect(@Res() res: Response) {
    const checkoutUrl = await this.paymentsService.redirect();
    // console.log('checkoutUrl in controller redirect:', checkoutUrl)
    return res.redirect(checkoutUrl!);
    // return res.redirect('https://www.google.com')
    // return {checkoutUrl}
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit gateway action (transient token or equivalent)' })
  async submitPayment(@Body() dto: SubmitPaymentDto) {
    return this.paymentsService.submitAction(dto);
  }

  @Get(':trackerToken')
  @ApiOperation({ summary: 'Poll tracker status' })
  async pollTracker(@Param('trackerToken') trackerToken: string) {
    return this.paymentsService.pollTracker(trackerToken);
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum PaymentIntent {
  CYBERSOURCE = 'CYBERSOURCE',
  MPGS = 'MPGS',
  PAYFAST = 'PAYFAST',
}

export class InitiatePaymentDto {
  @ApiProperty({ example: 50000, description: 'Payment amount in smallest currency unit' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'PKR', description: 'Currency code' })
  @IsString()
  currency: string;

  @ApiProperty({
    example: PaymentIntent.CYBERSOURCE,
    enum: PaymentIntent,
    description: 'Preferred payment gateway',
  })
  @IsEnum(PaymentIntent)
  intent: PaymentIntent;

  @ApiProperty({ example: 'card', description: 'Payment method type', required: false })
  @IsOptional()
  @IsString()
  payment_method_kind?: string;
}

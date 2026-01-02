import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 5000, description: 'Transaction amount in PKR' })
  amount: number;

  @ApiProperty({
    example: 'billRef123',
    description: 'Unique bill reference for this payment',
  })
  billReference: string;

  @ApiProperty({
    example: 'Order #123',
    description: 'Transaction description',
  })
  description: string;
}

export class PaymentCallbackDto {
  // If you want, you can define common known fields
  @ApiProperty({
    example: 'T1701081234567',
    description: 'Transaction reference number',
  })
  pp_TxnRefNo?: string;

  @ApiProperty({ example: '000', description: 'Response code from JazzCash' })
  pp_ResponseCode?: string;

  @ApiProperty({
    example: 'Transaction successful',
    description: 'Response message',
  })
  pp_ResponseMessage?: string;

  // For all other unknown fields, just accept the object
  [key: string]: any;
}

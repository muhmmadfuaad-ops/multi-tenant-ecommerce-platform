import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SubmitPaymentDto {
  @ApiProperty({ description: 'Tracker token received from initiate endpoint' })
  @IsString()
  trackerToken: string;

  @ApiProperty({ description: 'Action token / request ID for the current next_action' })
  @IsString()
  actionToken: string;

  @ApiProperty({ description: 'Transient token (CYBERSOURCE) or other gateway payload' })
  @IsString()
  transientToken: string;

  @ApiProperty({ description: 'Optional additional data for MPGS / PAYFAST', required: false })
  additionalData?: Record<string, any>;
}

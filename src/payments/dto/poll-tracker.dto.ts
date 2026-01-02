import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PollTrackerDto {
  @ApiProperty({ description: 'Tracker token to poll status' })
  @IsString()
  trackerToken: string;
}

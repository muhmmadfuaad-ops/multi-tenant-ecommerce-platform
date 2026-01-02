import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Hassan', description: 'First name' })
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Zaidi', description: 'Last name' })
  @IsString()
  last_name: string;

  @ApiProperty({ example: 'hzaidi@getsafepay.com', description: 'Email address' })
  @IsString()
  email: string;

  @ApiProperty({ example: '+923331234567', description: 'Phone number' })
  @IsString()
  phone_number: string;

  @ApiProperty({ example: 'PK', description: 'Country' })
  @IsString()
  country: string;
}

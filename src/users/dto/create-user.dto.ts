import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  email?: string; // optional as per your Prisma model

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  name?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number of the user',
  })
  phone?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password hash for the user',
  })
  passwordHash?: string;

  @ApiProperty({
    example: 'USER',
    description: 'Role of the user',
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  })
  role?: 'USER' | 'ADMIN';
}

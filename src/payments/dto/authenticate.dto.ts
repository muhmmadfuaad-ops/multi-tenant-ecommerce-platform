import { ApiProperty } from "@nestjs/swagger";

// dto/authenticate.dto.ts
export class AuthenticateDto {
  @ApiProperty({ example: 'zparekh@getsafepay.com' })
  email: string;

  @ApiProperty({ example: 'azazazazaz' })
  password: string;

  @ApiProperty({ example: 'client_bb1d600f-f174-49dc-a34f-a79c77e237c8', required: false })
  client?: string;
}

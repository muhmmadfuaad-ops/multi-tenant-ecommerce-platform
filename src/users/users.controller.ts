import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

console.log('users.controller.ts loaded');

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // constructor(private prisma: PrismaService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  findAll() {
    console.log('users.controller.ts loaded');
    return this.usersService.findAll();
  }

  // Find user by ID
  @Get('id/:id')
  findOneById(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  // Find user by Name
  @Get('name/:name')
  findOneByName(@Param('name') name: string) {
    return this.usersService.findAllByName(name);
  }

  @Get('search/:name')
  findAllByNameLike(@Param('name') name: string) {
    return this.usersService.findAllByNameLike(name);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}

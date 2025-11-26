import { Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  async findAll() {
    // console.log('this.prismaService:', this.prismaService);

    // console.log('this.prismaService.user:', this.prismaService.user);
    // console.log(
    //   'this.prismaService.prisma.user:',
    //   this.prismaService.prisma.user,
    // );

    return this.prismaService.prisma.user.findMany();
  }

  async findOneById(id: string) {
    return this.prismaService.prisma.user.findUnique({ where: { id } });
  }

  async findOneByName(name: string) {
    return this.prismaService.prisma.user.findFirst({ where: { name } });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}

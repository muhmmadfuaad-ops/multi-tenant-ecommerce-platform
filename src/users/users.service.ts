import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '../prisma/generated/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  // const prisma = this.prismaService.prisma
  private get prisma() {
    return this.prismaService.prisma;
  }

  // CREATE
  // async create(createUserDto: CreateUserDto) {
  //   return this.prisma.user.create({
  //     data: createUserDto,
  //   });
  // }
  //
  // // UPDATE
  // async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
  //   return this.prisma.user.update({
  //     where: { id },
  //     data: updateUserDto,
  //   });
  // }

  // DELETE
  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOneById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findAllByName(name: string) {
    return this.prisma.user.findMany({ where: { name } });
  }

  async findAllByNameLike(name: string) {
    return this.prisma.user.findMany({
      where: {
        name: {
          contains: name, // matches anywhere in the string
          mode: 'insensitive', // makes it case-insensitive
        },
      },
    });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}

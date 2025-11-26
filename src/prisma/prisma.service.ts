import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from './generated/client';
// import type { User, Order, Category, Product } from './generated/client';

import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
// import { User } from '../interfaces/user.interface';

// import { User } from '@prisma/client';
// console.log('process.env.DATABASE_URL:', process.env.DATABASE_URL);
console.log('prisma.service.ts loaded');
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  prisma = new PrismaClient({
    adapter,
  });

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  // async findAllUsers(): Promise<User[]> {
  //   return this.prisma.user.findMany(); // call Prisma client
  // }
  //
  // async findAllOrders(): Promise<Order[]> {
  //   return this.prisma.order.findMany(); // call Prisma client
  // }
  //
  // async findAllCategories(): Promise<Category[]> {
  //   return this.prisma.category.findMany(); // call Prisma client
  // }
  //
  // async findAllProducts(): Promise<Product[]> {
  //   return this.prisma.product.findMany(); // call Prisma client
  // }

  // async findUserByEmail(email: string): Promise<User | null> {
  //   // use Prisma client to avoid raw-SQL table-name mismatches
  //   return this.prisma.user.findUnique({
  //     where: { email },
  //   });
  // }
}

import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
// import { User } from './interfaces/user.interface';
// import type { User, Order, Category, Product } from './prisma/generated/client';

@Controller()
export class AppController {
  // constructor(
  //   // private readonly appService: AppService,
  //   private readonly prisma: PrismaService, // inject PrismaService here
  // ) {}
  // @Get('orders')
  // async getOrders(): Promise<Order[]> {
  //   return await this.prisma.findAllOrders();
  // }
  //
  // @Get('categories')
  // async getCategories(): Promise<Category[]> {
  //   return await this.prisma.findAllCategories();
  // }
  //
  // @Get('products')
  // async getProducts(): Promise<Product[]> {
  //   return await this.prisma.findAllProducts();
  // }
  // @Get('tenants')
  // async getTenants(): Promise<Tenant[]> {
  //   return await this.prisma.findAllTenants();
  // }
  //
  // @Get('addresses')
  // async getAddresses(): Promise<Address[]> {
  //   return await this.prisma.findAllAddresses();
  // }
  //
  // @Get('sessions')
  // async getSessions(): Promise<Session[]> {
  //   return await this.prisma.findAllSessions();
  // }
  //
  // @Get('otps')
  // async getOtps(): Promise<OTP[]> {
  //   return await this.prisma.findAllOtps();
  // }
}

// prisma/seed.ts
// import { PrismaClient } from '@prisma/client';
// import { type PrismaClient } from './generated/internal/class.js';
import { PrismaClient } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

console.log('process.env.DATABASE_URL:', process.env.DATABASE_URL);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
// const prisma = new PrismaClient({ datasources: {} });
// const prisma = new PrismaClient();

async function main() {
  // ------------------------------
  // 1️⃣ Create Tenants
  // ------------------------------
  const acme = await prisma.tenant.create({
    data: { name: 'Acme Corp', domain: 'acme.com' },
  });

  const beta = await prisma.tenant.create({
    data: { name: 'Beta LLC', domain: 'beta.com' },
  });

  // ------------------------------
  // 2️⃣ Create Users
  // ------------------------------
  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@acme.com',
      phone: '1234567890',
      role: 'ADMIN',
      tenantId: acme.id,
      passwordHash: 'hash1',
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@acme.com',
      phone: '1234567891',
      tenantId: acme.id,
      passwordHash: 'hash2',
    },
  });

  const carol = await prisma.user.create({
    data: {
      name: 'Carol',
      email: 'carol@beta.com',
      phone: '9876543210',
      role: 'ADMIN',
      tenantId: beta.id,
      passwordHash: 'hash3',
    },
  });

  const dave = await prisma.user.create({
    data: {
      name: 'Dave',
      email: 'dave@beta.com',
      phone: '9876543211',
      tenantId: beta.id,
      passwordHash: 'hash4',
    },
  });

  // ------------------------------
  // 3️⃣ Create Categories
  // ------------------------------
  const electronics = await prisma.category.create({
    data: { name: 'Electronics' },
  });
  const books = await prisma.category.create({ data: { name: 'Books' } });
  const clothing = await prisma.category.create({ data: { name: 'Clothing' } });

  // ------------------------------
  // 4️⃣ Create Products
  // ------------------------------
  const laptop = await prisma.product.create({
    data: {
      name: 'Laptop',
      description: 'High-end gaming laptop',
      price: 1500,
      status: 'PUBLISHED',
      stock: 10,
      tenantId: acme.id,
      sellerId: alice.id,
      categories: { connect: [{ id: electronics.id }] },
    },
  });

  const smartphone = await prisma.product.create({
    data: {
      name: 'Smartphone',
      description: 'Latest smartphone',
      price: 800,
      status: 'PUBLISHED',
      stock: 20,
      tenantId: acme.id,
      sellerId: bob.id,
      categories: { connect: [{ id: electronics.id }] },
    },
  });

  const novel = await prisma.product.create({
    data: {
      name: 'Novel Book',
      description: 'Interesting novel',
      price: 20,
      status: 'PUBLISHED',
      stock: 50,
      tenantId: beta.id,
      sellerId: carol.id,
      categories: { connect: [{ id: books.id }] },
    },
  });

  // ------------------------------
  // 5️⃣ Create Orders & OrderItems
  // ------------------------------
  const order1 = await prisma.order.create({
    data: {
      totalAmount: 2300,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      buyerId: bob.id,
      tenantId: acme.id,
      items: {
        create: [
          { productId: laptop.id, quantity: 1, price: 1500 },
          { productId: smartphone.id, quantity: 1, price: 800 },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      totalAmount: 40,
      status: 'CONFIRMED',
      paymentStatus: 'COMPLETED',
      buyerId: dave.id,
      tenantId: beta.id,
      items: { create: [{ productId: novel.id, quantity: 2, price: 20 }] },
    },
  });

  // ------------------------------
  // 6️⃣ Create Addresses
  // ------------------------------
  await prisma.address.createMany({
    data: [
      {
        userId: bob.id,
        line1: '123 Main St',
        line2: 'Apt 1',
        city: 'New York',
        state: 'NY',
        postal: '10001',
        country: 'USA',
      },
      {
        userId: dave.id,
        line1: '456 Market St',
        line2: '',
        city: 'San Francisco',
        state: 'CA',
        postal: '94105',
        country: 'USA',
      },
    ],
  });

  // ------------------------------
  // 7️⃣ Create Sessions
  // ------------------------------
  await prisma.session.createMany({
    data: [
      {
        userId: bob.id,
        refreshToken: 'rtoken1',
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userAgent: 'Chrome',
        ipAddress: '192.168.1.10',
        ipMeta: { os: 'Windows' },
      },
      {
        userId: dave.id,
        refreshToken: 'rtoken2',
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: 'Firefox',
        ipAddress: '192.168.1.11',
        ipMeta: { os: 'MacOS' },
      },
    ],
  });

  // ------------------------------
  // 8️⃣ Create OTPs
  // ------------------------------
  await prisma.oTP.createMany({
    data: [
      {
        code: '123456',
        type: 'EMAIL',
        verified: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        userId: bob.id,
      },
      {
        code: '654321',
        type: 'PHONE',
        verified: true,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        userId: dave.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

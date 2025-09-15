const { PrismaClient } = require('../../generated/prisma');
const bcrypt = require('bcrypt');

async function main() {
  const prisma = new PrismaClient();
  await prisma.employee.create({
    data: {
      name: 'Test User',
      email: 'test@company.com',
      passwordHash: bcrypt.hashSync('password', 10),
      position: 'Staff',
      phone: '08123456789',
    },
  });
  await prisma.$disconnect();
  console.log('Dummy employee created');
}

main();

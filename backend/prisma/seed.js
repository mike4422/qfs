import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main(){
  const admin = await prisma.user.upsert({
    where: { email: 'admin@qfs.test' },
    update: {},
    create: {
      name: 'Admin', email: 'admin@qfs.test', password: await bcrypt.hash('Admin123!', 10), role: 'ADMIN', emailVerified: true
    }
  })

  await prisma.transaction.createMany({ data: [
    { ref: 'TX-001', type: 'DEPOSIT', amount: '500 USDT', status: 'CONFIRMED', userId: admin.id },
    { ref: 'TX-002', type: 'WITHDRAWAL', amount: '200 USDT', status: 'PENDING', userId: admin.id }
  ]})

  console.log('Seeded!')
}

main().finally(()=>prisma.$disconnect())
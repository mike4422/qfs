// quick one-off script (node -e " ... ")
import('bcryptjs').then(async ({default: bcrypt})=>{
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  const email = 'mikeclinton508@gmail.com';
  const hash = await bcrypt.hash('Mike4422#$', 12);
  await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN', password: hash, emailVerified: true }
  }).catch(async () => {
    await prisma.user.create({
      data: { name: 'Admin', username: 'admin', email, password: hash, role: 'ADMIN', emailVerified: true }
    });
  });
  console.log('Admin ready. Email:', email);
  process.exit(0);
});

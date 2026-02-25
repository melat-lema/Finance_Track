const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
 const hashedPassword = await bcrypt.hash('password123', 12);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@financeflow.com' },
    update: {},
    create: {
      username: 'demo_user',
      email: 'demo@financeflow.com',
      password: hashedPassword,
    },
  });
  const sampleTransactions = [
    { amount: 5000, type: 'INCOME', category: 'Salary', description: 'Monthly salary', date: new Date() },
    { amount: 250, type: 'EXPENSE', category: 'Food', description: 'Grocery shopping', date: new Date() },
    { amount: 120, type: 'EXPENSE', category: 'Entertainment', description: 'Netflix subscription', date: new Date() },
    { amount: 80, type: 'EXPENSE', category: 'Transport', description: 'Gas', date: new Date() },
    { amount: 1200, type: 'EXPENSE', category: 'Utilities', description: 'Electric bill', date: new Date() },
  ];

  await prisma.transaction.createMany({
    data: sampleTransactions.map(t => ({
      ...t,
      userId: demoUser.id,
    })),
    skipDuplicates: true,
  });


}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
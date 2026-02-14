
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'status') {
    await showStatus();
  } else if (command === 'wipe') {
    await wipeData();
  } else {
    console.log('--- Database Ops Utility ---');
    console.log('Usage: npx tsx prisma/db-ops.ts [status|wipe]');
    await showStatus();
  }
}

async function showStatus() {
  console.log('\n📊 DATABASE AUDIT STATUS:');
  const [users, posts, accounts, sessions] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.account.count(),
    prisma.session.count()
  ]);

  console.table({
    'Users': users,
    'Posts': posts,
    'Connected Accounts': accounts,
    'Active Sessions': sessions
  });
}

async function wipeData() {
  console.log('⚠️  DANGER: Starting full data wipe...');
  try {
    // Delete in order to avoid foreign key violations
    await prisma.post.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ CLEANED: Database is now empty.');
  } catch (error) {
    console.error('❌ FAILED:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

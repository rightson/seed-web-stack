import { prisma } from './prisma';

export async function verifyDatabaseConnection() {
  console.log('🔍 Verifying database connection...');

  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error instanceof Error ? error.message : error);
    console.error('💡 Try running: npx prisma migrate dev\n');
    throw error;
  }
}

import { PrismaClient } from '@prisma/client';
import logger from '../modules/logger';

const prisma = new PrismaClient();

function delay(time: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time);
  });
}

export async function connectPrisma() {
  try {
    await prisma.$connect();
  } catch (error) {
    logger.error(error);
    logger.error('db connection error');
    await delay(3000);
    await connectPrisma();
  }
}

export function getClient() {
  return prisma;
}

import { PrismaClient } from '@prisma/client';
import logger from '../modules/logger';

const prisma = new PrismaClient();

export async function connectPrisma() {
  try {
    await prisma.$connect();
  } catch (error) {
    logger.error(error);
    logger.error('db connection error');
  }
}

export function getClient() {
  return prisma;
}

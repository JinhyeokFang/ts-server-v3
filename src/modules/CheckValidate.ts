import { validate } from 'class-validator';

export default async function checkValidate(object: Record<string, unknown>): Promise<boolean> {
  try {
    await validate(object);
    return true;
  } catch (error) {
    return false;
  }
}
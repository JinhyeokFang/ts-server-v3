import { Document } from 'mongoose';
import { validate } from 'class-validator';

export default async function checkValidate(object: Document): Promise<boolean> {
  try {
    await validate(object);
    return true;
  } catch (err) {
    return false;
  }
}
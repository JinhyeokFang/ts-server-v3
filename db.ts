import mongoose from 'mongoose';

export default class DB {
  public static initialize(name: string): void {
    mongoose.connect(`mongodb://localhost/${name}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

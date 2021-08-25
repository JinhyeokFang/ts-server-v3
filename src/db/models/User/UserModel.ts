import {
  Schema, model, Model, Document,
} from 'mongoose';

class User extends Document {
  username: string;

  profileImageURL: string;
}

interface UserWithPasswordAndSalt extends User {
  password: string;

  iv: string;

  key: string;
}

const userSchema = new Schema({
  username: { type: String, required: true },
  profileImageURL: { type: String, required: true },
  password: { type: String, required: true },
  iv: { type: String, required: true },
  key: { type: String, required: true },
});

const UserModel: Model<UserWithPasswordAndSalt> = model('user', userSchema);

export { User, UserModel };

import {
  Schema, model, Model, Document,
} from 'mongoose';

interface IUser extends Record<string, unknown> {
  username: string;
  profileImageURL: string;
}

interface IUserModel extends Document, IUser {
  username: string;
  password: string;
  profileImageURL: string;
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

const UserModel: Model<IUserModel> = model('user', userSchema);

export { IUser, UserModel, IUserModel };

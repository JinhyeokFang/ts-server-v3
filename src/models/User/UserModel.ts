import {
  Schema, model, Model, Document,
} from 'mongoose';

interface IUserModel extends Document {
  username: string;
  password: string;
  profileImageURL: string;
  iv: string;
  key: string;
}

const userSchema = new Schema({
  username: String,
  password: String,
  profileImageURL: String,
  iv: String,
});

const UserModel: Model<IUserModel> = model('user', userSchema);

export { UserModel, IUserModel };

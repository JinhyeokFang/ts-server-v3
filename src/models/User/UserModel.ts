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
  username: { type: String, required: true },
  profileImageURL: { type: String, required: true },
  password: { type: String, required: true },
  profileImageURL: { type: String, required: true },
  iv: { type: String, required: true },
});

const UserModel: Model<IUserModel> = model('user', userSchema);

export { UserModel, IUserModel };

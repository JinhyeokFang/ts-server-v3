import {
  Schema, model, Model, Document,
} from 'mongoose';

interface IUserModel extends Document {
    username: string;
    password: string;
}

const userSchema = new Schema({
  username: String,
  password: String,
});

const UserModel: Model<IUserModel> = model('user', userSchema);

export { UserModel, IUserModel };

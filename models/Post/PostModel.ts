import {
  Schema, model, Model, Document,
} from 'mongoose';

interface IPostModel extends Document {
    username: string;
    password: string;
}

const postSchema = new Schema({
  username: String,
  password: String,
});

const PostModel: Model<IPostModel> = model('post', postSchema);

export { PostModel, IPostModel };

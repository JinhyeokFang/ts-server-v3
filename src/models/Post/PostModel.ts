import {
  Schema, model, Model, Document,
} from 'mongoose';

interface IPostModel extends Document {
  username: string;
  title: string;
  contents: string;
  date: Date;
}

const postSchema = new Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  contents: { type: String, required: true },
  date: { type: String, required: true },
});

const PostModel: Model<IPostModel> = model('post', postSchema);

export { PostModel, IPostModel };

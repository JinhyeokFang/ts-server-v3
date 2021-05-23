import {
  Schema, model, Model, Document,
} from 'mongoose';

interface ICommentModel extends Document {
    username: string;
    password: string;
}

const commentSchema = new Schema({
  username: String,
  password: String,
});

const CommentModel: Model<ICommentModel> = model('comment', commentSchema);

export { CommentModel, ICommentModel };

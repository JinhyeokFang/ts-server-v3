import {
  Schema, model, Model, Document,
} from 'mongoose';

interface ICommentModel extends Document {
  postId: string;
  username: string;
  content: string;
  date: Date;
}

const commentSchema = new Schema({
  postId: { type: String, required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
});

const CommentModel: Model<ICommentModel> = model('comment', commentSchema);

export { CommentModel, ICommentModel };

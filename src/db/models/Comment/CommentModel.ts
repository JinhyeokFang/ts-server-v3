import { IsMongoId, IsString } from 'class-validator';
import {
  Schema, model, Model, Document,
} from 'mongoose';

class Comment extends Document {
  @IsMongoId()
  postId: string;

  username: string;

  @IsString()
  content: string;

  date: Date;
}

const commentSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'post', required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true, default: Date.now },
});

const CommentModel: Model<Comment> = model('comment', commentSchema);

export { CommentModel, Comment };

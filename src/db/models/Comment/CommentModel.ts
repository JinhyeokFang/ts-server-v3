import { IsMongoId, IsString } from 'class-validator';
import {
  Schema, model, Model, Document,
} from 'mongoose';

class Comment extends Document {
  username: string;

  @IsString()
  content: string;

  date: Date;
}

const commentSchema = new Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
}, {
  timestamps: true
});

const CommentModel: Model<Comment> = model('comment', commentSchema);

export { CommentModel, Comment };

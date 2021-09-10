import { IsString } from 'class-validator';
import {
  Schema, model, Model, Document, Types,
} from 'mongoose';

class Post extends Document {
  username: string;

  @IsString()
  title: string;

  @IsString()
  contents: string;
}

// populate 사용하지 말 것.
const postSchema = new Schema({
  username: { type: String, required: true },
  title: { type: String, required: true, default: '제목 없음' },
  contents: { type: String, required: true, default: '내용 없음' },
  comments: [ Types.ObjectId ],
}, {
  timestamps: true
});

const PostModel: Model<Post> = model('post', postSchema);

export { PostModel, Post };

import { ObjectId } from 'mongoose';

export class CommentDto {
  readonly username: string;
  readonly text: string;
  readonly trackId: ObjectId;
}

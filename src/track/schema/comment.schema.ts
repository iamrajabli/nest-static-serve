import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Track } from './track.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop()
  username: string;

  @Prop()
  text: string;

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Track' } })
  trackId: Track;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

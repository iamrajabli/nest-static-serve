import { Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from './schema/track.schema';
import { Comment, CommentDocument } from './schema/comment.schema';
import { TrackDto } from './dto/track.dto';
import { CommentDto } from './dto/comment.dto';
import { FileService, FileType } from '../files/file.service';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,

    private fileService: FileService,
  ) {}

  async create(dto: TrackDto, audio, picture): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    return await this.trackModel.create({
      ...dto,
      listens: 0,
      audio: audioPath,
      picture: picturePath,
    });
  }

  async getAll(count = 2, offset = 0, query): Promise<Track[]> {
    return this.trackModel
      .find({
        name: {
          $regex: new RegExp(query, 'i'),
        },
      })
      .limit(count)
      .skip(offset);
  }

  async getOne(id: ObjectId): Promise<Track> {
    return this.trackModel.findById(id).populate('comments');
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const track = await this.trackModel.findByIdAndDelete(id);
    return track.id;
  }

  async addComment(dto: CommentDto): Promise<Comment> {
    const tracks = await this.trackModel.findById(dto.trackId);
    const comment = await this.commentModel.create({ ...dto });
    tracks.comments.push(comment.id);
    await tracks.save();
    return comment;
  }

  async listen(id: ObjectId) {
    const track = await this.trackModel.findById(id);
    track.listens += 1;

    await track.save();
  }
}

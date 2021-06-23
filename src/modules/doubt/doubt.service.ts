import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDoubtDto } from './dto/create-doubt.dto';
import { DoubtDocument as Doubt } from './schema/doubt.schema';

@Injectable()
export class DoubtService {
  constructor(
    @InjectModel('Doubt') private readonly DoubtModel: Model<Doubt>,
  ) {}

  async getAllDoubts(): Promise<Doubt[]> {
    try {
      return await this.DoubtModel.find().exec();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findDoubtById(id: string): Promise<Doubt> {
    try {
      const doubt = await this.DoubtModel.findById(id).exec();

      if (doubt) {
        return doubt;
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    throw new NotFoundException('doubt not found!');
  }

  async addNewDoubt(newDoubt: CreateDoubtDto) {
    try {
      return await new this.DoubtModel(newDoubt).save();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}

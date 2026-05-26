import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTrialDto } from './dto/create-trial.dto';
import { UpdateTrialDto } from './dto/update-trial.dto';
import { Trial, TrialDocument } from './trial.schema';

@Injectable()
export class TrialsService {
  constructor(@InjectModel(Trial.name) private trialModel: Model<TrialDocument>) {}

  create(createTrialDto: CreateTrialDto) {
    return new this.trialModel(createTrialDto).save();
  }

  findAll() {
    return this.trialModel.find().sort({ createdAt: -1 }).exec();
  }

  findOne(id: string) {
    return this.trialModel.findById(id).exec();
  }

  update(id: string, updateTrialDto: UpdateTrialDto) {
    return this.trialModel.findByIdAndUpdate(id, updateTrialDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.trialModel.findByIdAndDelete(id).exec();
  }
}

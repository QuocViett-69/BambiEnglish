import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch, BranchDocument } from './branch.schema';

@Injectable()
export class BranchesService {
  constructor(@InjectModel(Branch.name) private branchModel: Model<BranchDocument>) {}

  create(createBranchDto: CreateBranchDto) {
    return new this.branchModel(createBranchDto).save();
  }

  findAll() {
    return this.branchModel.find().exec();
  }

  findOne(id: string) {
    return this.branchModel.findById(id).exec();
  }

  update(id: string, updateBranchDto: UpdateBranchDto) {
    return this.branchModel.findByIdAndUpdate(id, updateBranchDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.branchModel.findByIdAndDelete(id).exec();
  }
}

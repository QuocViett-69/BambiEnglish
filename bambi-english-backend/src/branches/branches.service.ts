import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  // ─── Review CRUD ──────────────────────────────────────────────────────────

  async addReview(branchId: string, reviewData: any) {
    const branch = await this.branchModel.findById(branchId);
    if (!branch) throw new NotFoundException('Branch not found');
    const review = { ...reviewData, _id: new Types.ObjectId() };
    branch.reviews.push(review as any);
    return branch.save();
  }

  async updateReview(branchId: string, reviewIndex: number, reviewData: any) {
    const branch = await this.branchModel.findById(branchId);
    if (!branch) throw new NotFoundException('Branch not found');
    if (reviewIndex < 0 || reviewIndex >= branch.reviews.length) {
      throw new NotFoundException('Review not found');
    }
    Object.assign(branch.reviews[reviewIndex], reviewData);
    branch.markModified('reviews');
    return branch.save();
  }

  async deleteReview(branchId: string, reviewIndex: number) {
    const branch = await this.branchModel.findById(branchId);
    if (!branch) throw new NotFoundException('Branch not found');
    branch.reviews.splice(reviewIndex, 1);
    branch.markModified('reviews');
    return branch.save();
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const branch_schema_1 = require("./branch.schema");
let BranchesService = class BranchesService {
    branchModel;
    constructor(branchModel) {
        this.branchModel = branchModel;
    }
    create(createBranchDto) {
        return new this.branchModel(createBranchDto).save();
    }
    findAll() {
        return this.branchModel.find().exec();
    }
    findOne(id) {
        return this.branchModel.findById(id).exec();
    }
    update(id, updateBranchDto) {
        return this.branchModel.findByIdAndUpdate(id, updateBranchDto, { new: true }).exec();
    }
    remove(id) {
        return this.branchModel.findByIdAndDelete(id).exec();
    }
    async addReview(branchId, reviewData) {
        const branch = await this.branchModel.findById(branchId);
        if (!branch)
            throw new common_1.NotFoundException('Branch not found');
        const review = { ...reviewData, _id: new mongoose_2.Types.ObjectId() };
        branch.reviews.push(review);
        return branch.save();
    }
    async updateReview(branchId, reviewIndex, reviewData) {
        const branch = await this.branchModel.findById(branchId);
        if (!branch)
            throw new common_1.NotFoundException('Branch not found');
        if (reviewIndex < 0 || reviewIndex >= branch.reviews.length) {
            throw new common_1.NotFoundException('Review not found');
        }
        Object.assign(branch.reviews[reviewIndex], reviewData);
        branch.markModified('reviews');
        return branch.save();
    }
    async deleteReview(branchId, reviewIndex) {
        const branch = await this.branchModel.findById(branchId);
        if (!branch)
            throw new common_1.NotFoundException('Branch not found');
        branch.reviews.splice(reviewIndex, 1);
        branch.markModified('reviews');
        return branch.save();
    }
};
exports.BranchesService = BranchesService;
exports.BranchesService = BranchesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(branch_schema_1.Branch.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BranchesService);
//# sourceMappingURL=branches.service.js.map
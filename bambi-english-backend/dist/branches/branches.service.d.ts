import { Model, Types } from 'mongoose';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch, BranchDocument } from './branch.schema';
export declare class BranchesService {
    private branchModel;
    constructor(branchModel: Model<BranchDocument>);
    create(createBranchDto: CreateBranchDto): Promise<import("mongoose").Document<unknown, {}, BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & Branch & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & Branch & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & Branch & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    update(id: string, updateBranchDto: UpdateBranchDto): Promise<(import("mongoose").Document<unknown, {}, BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & Branch & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & Branch & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    addReview(branchId: string, reviewData: any): Promise<import("mongoose").Document<unknown, {}, BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & Branch & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateReview(branchId: string, reviewIndex: number, reviewData: any): Promise<import("mongoose").Document<unknown, {}, BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & Branch & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteReview(branchId: string, reviewIndex: number): Promise<import("mongoose").Document<unknown, {}, BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & Branch & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}

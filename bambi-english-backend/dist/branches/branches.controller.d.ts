import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
export declare class BranchesController {
    private readonly branchesService;
    constructor(branchesService: BranchesService);
    create(createBranchDto: CreateBranchDto): Promise<import("mongoose").Document<unknown, {}, import("./branch.schema").BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./branch.schema").Branch & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./branch.schema").BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./branch.schema").Branch & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./branch.schema").BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./branch.schema").Branch & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    update(id: string, updateBranchDto: UpdateBranchDto): Promise<(import("mongoose").Document<unknown, {}, import("./branch.schema").BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./branch.schema").Branch & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./branch.schema").BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./branch.schema").Branch & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    addReview(id: string, reviewData: any): Promise<import("mongoose").Document<unknown, {}, import("./branch.schema").BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./branch.schema").Branch & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateReview(id: string, index: string, reviewData: any): Promise<import("mongoose").Document<unknown, {}, import("./branch.schema").BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./branch.schema").Branch & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteReview(id: string, index: string): Promise<import("mongoose").Document<unknown, {}, import("./branch.schema").BranchDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./branch.schema").Branch & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}

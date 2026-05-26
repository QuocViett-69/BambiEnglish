import { Model } from 'mongoose';
import { CreateTrialDto } from './dto/create-trial.dto';
import { UpdateTrialDto } from './dto/update-trial.dto';
import { Trial, TrialDocument } from './trial.schema';
export declare class TrialsService {
    private trialModel;
    constructor(trialModel: Model<TrialDocument>);
    create(createTrialDto: CreateTrialDto): Promise<import("mongoose").Document<unknown, {}, TrialDocument, {}, import("mongoose").DefaultSchemaOptions> & Trial & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, TrialDocument, {}, import("mongoose").DefaultSchemaOptions> & Trial & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, TrialDocument, {}, import("mongoose").DefaultSchemaOptions> & Trial & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    update(id: string, updateTrialDto: UpdateTrialDto): Promise<(import("mongoose").Document<unknown, {}, TrialDocument, {}, import("mongoose").DefaultSchemaOptions> & Trial & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, TrialDocument, {}, import("mongoose").DefaultSchemaOptions> & Trial & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

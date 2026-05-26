import { TrialsService } from './trials.service';
import { CreateTrialDto } from './dto/create-trial.dto';
import { UpdateTrialDto } from './dto/update-trial.dto';
export declare class TrialsController {
    private readonly trialsService;
    constructor(trialsService: TrialsService);
    create(createTrialDto: CreateTrialDto): Promise<import("mongoose").Document<unknown, {}, import("./trial.schema").TrialDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./trial.schema").Trial & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./trial.schema").TrialDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./trial.schema").Trial & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./trial.schema").TrialDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./trial.schema").Trial & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    update(id: string, updateTrialDto: UpdateTrialDto): Promise<(import("mongoose").Document<unknown, {}, import("./trial.schema").TrialDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./trial.schema").Trial & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./trial.schema").TrialDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./trial.schema").Trial & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

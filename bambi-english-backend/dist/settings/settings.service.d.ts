import { Model } from 'mongoose';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting, SettingDocument } from './setting.schema';
export declare class SettingsService {
    private settingModel;
    constructor(settingModel: Model<SettingDocument>);
    getSettings(): Promise<import("mongoose").Document<unknown, {}, SettingDocument, {}, import("mongoose").DefaultSchemaOptions> & Setting & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateSettings(updateSettingDto: UpdateSettingDto): Promise<(import("mongoose").Document<unknown, {}, SettingDocument, {}, import("mongoose").DefaultSchemaOptions> & Setting & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<import("mongoose").Document<unknown, {}, import("./setting.schema").SettingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./setting.schema").Setting & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateSettings(updateSettingDto: UpdateSettingDto): Promise<(import("mongoose").Document<unknown, {}, import("./setting.schema").SettingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./setting.schema").Setting & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

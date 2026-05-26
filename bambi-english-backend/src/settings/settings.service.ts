import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting, SettingDocument } from './setting.schema';

@Injectable()
export class SettingsService {
  constructor(@InjectModel(Setting.name) private settingModel: Model<SettingDocument>) {}

  async getSettings() {
    let settings = await this.settingModel.findOne().exec();
    if (!settings) {
      settings = await new this.settingModel({}).save();
    }
    return settings;
  }

  async updateSettings(updateSettingDto: UpdateSettingDto) {
    const settings = await this.getSettings();
    return this.settingModel.findByIdAndUpdate(settings._id, updateSettingDto, { new: true }).exec();
  }
}

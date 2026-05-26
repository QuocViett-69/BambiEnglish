import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrialsService } from './trials.service';
import { TrialsController } from './trials.controller';
import { Trial, TrialSchema } from './trial.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Trial.name, schema: TrialSchema }])],
  controllers: [TrialsController],
  providers: [TrialsService],
})
export class TrialsModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CoursesModule } from './courses/courses.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { SeedService } from './seed/seed.service';
import { Course, CourseSchema } from './courses/course.schema';
import { Branch, BranchSchema } from './branches/branch.schema';
import { Registration, RegistrationSchema } from './registrations/registration.schema';
import { Trial, TrialSchema } from './trials/trial.schema';
import { SettingsModule } from './settings/settings.module';
import { TrialsModule } from './trials/trials.module';
import { BranchesModule } from './branches/branches.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/bambi-english'),
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Registration.name, schema: RegistrationSchema },
      { name: Trial.name, schema: TrialSchema },
    ]),
    HttpModule,
    CoursesModule,
    RegistrationsModule,
    SettingsModule,
    TrialsModule,
    BranchesModule,
  ],
  providers: [SeedService],
})
export class AppModule {}

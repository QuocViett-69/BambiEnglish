import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CoursesModule } from './courses/courses.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { SeedService } from './seed/seed.service';
import { Course, CourseSchema } from './courses/course.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/bambi-english'),
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    HttpModule,
    CoursesModule,
    RegistrationsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}

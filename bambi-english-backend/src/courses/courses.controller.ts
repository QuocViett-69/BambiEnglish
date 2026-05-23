import { Controller, Get, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // GET /api/courses
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  // GET /api/courses/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findById(id);
  }
}

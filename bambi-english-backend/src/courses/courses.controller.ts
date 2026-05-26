import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // GET /api/courses — Public: chỉ khóa học active
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  // GET /api/courses/admin/all — Admin: tất cả khóa học (kể cả hidden)
  @Get('admin/all')
  findAllAdmin() {
    return this.coursesService.findAllAdmin();
  }

  // GET /api/courses/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findById(id);
  }

  // POST /api/courses — Tạo khóa học mới (Admin)
  @Post()
  create(@Body() body: any) {
    return this.coursesService.create(body);
  }

  // PATCH /api/courses/:id — Cập nhật khóa học (Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.coursesService.update(id, body);
  }

  // DELETE /api/courses/:id — Xóa khóa học (Admin)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coursesService.delete(id);
  }
}

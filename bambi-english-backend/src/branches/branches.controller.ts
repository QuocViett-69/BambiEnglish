import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  findAll() {
    return this.branchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchesService.remove(id);
  }

  // ─── Review endpoints ──────────────────────────────────────────────────────

  // POST /api/branches/:id/reviews — Thêm đánh giá mới
  @Post(':id/reviews')
  addReview(@Param('id') id: string, @Body() reviewData: any) {
    return this.branchesService.addReview(id, reviewData);
  }

  // PATCH /api/branches/:id/reviews/:index — Sửa đánh giá theo index
  @Patch(':id/reviews/:index')
  updateReview(
    @Param('id') id: string,
    @Param('index') index: string,
    @Body() reviewData: any,
  ) {
    return this.branchesService.updateReview(id, parseInt(index), reviewData);
  }

  // DELETE /api/branches/:id/reviews/:index — Xóa đánh giá theo index
  @Delete(':id/reviews/:index')
  deleteReview(@Param('id') id: string, @Param('index') index: string) {
    return this.branchesService.deleteReview(id, parseInt(index));
  }
}

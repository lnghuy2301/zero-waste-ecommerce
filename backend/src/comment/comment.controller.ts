import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  // Query,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/auth.role.guard';
import { Roles } from '../auth/auth.role.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
// import { GetCommentsFilterDto } from './dto/get-comments-filter.dto';
import { DeleteListCommentDto } from './dto/delete-list-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // Người dùng tạo bình luận
  @Post('product/:productId')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('Token không hợp lệ');
    return this.commentService.create(userId, productId, createCommentDto);
  }

  // Admin lấy tất cả bình luận
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAllForAdmin() {
    return this.commentService.getAllForAdmin();
  }

  // Admin xóa bình luận
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.delete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete()
  async deleteMany(@Body() dto: DeleteListCommentDto) {
    return this.commentService.deleteMany(dto);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsFilterDto } from './dto/get-comments-filter.dto';
import { Role } from '@prisma/client';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bình luận (có thể lọc)' })
  findAll(@Query() filterDto: GetCommentsFilterDto) {
    return this.commentService.findAll(filterDto);
  }

  @Post('product/:productId')
  @ApiOperation({
    summary: 'Tạo đánh giá mới (Yêu cầu đăng nhập & Đã mua hàng)',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException(
        'Không xác định được người dùng từ token',
      );
    }
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('Token không hợp lệ hoặc hết hạn');
    }
    return this.commentService.create(userId, productId, createCommentDto);
  }

  @Patch(':id/visibility')
  @ApiOperation({ summary: 'Ẩn/Hiện bình luận (Chỉ dành cho Admin)' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async toggleVisibility(
    @Param('id', ParseIntPipe) id: number,
    @Body('isHidden') isHidden: boolean,
    @Req() req: any,
  ) {
    // Kiểm tra quyền: Nếu không có user trong request hoặc role không phải ADMIN thì chặn lại
    if (!req.user || req.user.role !== Role.ADMIN) {
      throw new ForbiddenException('Chỉ có Admin mới có quyền ẩn/hiện bình luận.');
    }

    return this.commentService.toggleVisibility(id, isHidden);
  }
}

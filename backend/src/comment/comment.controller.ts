import {
    Body,
    Controller, Get,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UseGuards,
    Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsFilterDto } from './dto/get-comments-filter.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách bình luận (có thể lọc)' })
    findAll(@Query() filterDto: GetCommentsFilterDto) {
        return this.commentService.findAll(filterDto);
    }

    @Post()
    @ApiOperation({ summary: 'Tạo đánh giá mới (Yêu cầu đăng nhập & Đã mua hàng)' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    create(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() createCommentDto: CreateCommentDto,
        @Req() req: any,
    ) {
        const userId = req.user.id;

        return this.commentService.create(userId, productId, createCommentDto);
    }
}
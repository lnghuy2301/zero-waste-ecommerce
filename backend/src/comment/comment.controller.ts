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
import { CommentRequestDto } from './dto/comment.request.dto';
import { CommentResponseDto } from './dto/comment.response.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Body() commentRequestDto: CommentRequestDto): Promise<CommentResponseDto> {
        return this.commentService.create(commentRequestDto);
    }

    @Get()
    findAll(@Query() filterDto: CommentResponseDto) {
        return this.commentService.findAll(filterDto);
    }
}
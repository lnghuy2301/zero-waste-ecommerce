import {
    Controller,
    Delete,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { fileFilter, multerStorage } from './config/multer.config';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller()
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Post('comments/:commentId/media')
    @ApiOperation({ summary: 'Upload media cho một bình luận (Ảnh/Video)' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiConsumes('multipart/form-data') // Báo cho Swagger biết đây là API upload file
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file', { storage: multerStorage, fileFilter }))
    uploadReviewMedia(
        @Param('commentId', ParseIntPipe) commentId: number,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        const userId = req.user.id;
        return this.mediaService.uploadReviewMedia(userId, commentId, file);
    }

    @Delete('media/:mediaId')
    @ApiOperation({ summary: 'Xóa một media khỏi bình luận' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    deleteReviewMedia(
        @Param('mediaId', ParseIntPipe) mediaId: number,
        @Req() req: any,
    ) {
        const userId = req.user.id;
        return this.mediaService.deleteReviewMedia(userId, mediaId);
    }
}
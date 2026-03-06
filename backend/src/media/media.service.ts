import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async uploadReviewMedia(
    userId: number,
    commentId: number,
    file: Express.Multer.File,
  ) {
    // 1. Kiểm tra xem comment có tồn tại không
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận.');
    }

    // 2. KIỂM TRA QUYỀN: User này có phải là chủ của bình luận không?
    if (comment.accountId !== userId) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa bình luận này.',
      );
    }

    // 3. Xác định loại file (IMAGE/VIDEO)
    const fileType = file.mimetype.startsWith('image') ? 'IMAGE' : 'VIDEO';

    // 4. Lưu thông tin file vào Database
    return this.prisma.reviewMedia.create({
      data: {
        commentId: commentId,
        url: `/uploads/${file.filename}`, // Lưu đường dẫn tương đối
        type: fileType,
      },
    });
  }

  async deleteReviewMedia(userId: number, mediaId: number) {
    // 1. Tìm media và comment tương ứng
    const media = await this.prisma.reviewMedia.findUnique({
      where: { id: mediaId },
      include: { comment: true }, // Lấy luôn thông tin comment cha
    });

    if (!media) {
      throw new NotFoundException('Không tìm thấy media.');
    }

    // 2. KIỂM TRA QUYỀN
    if (media.comment.accountId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa media này.');
    }

    // 3. Xóa file vật lý khỏi server (TODO trong production)
    // fs.unlinkSync(`./uploads/${media.url.split('/').pop()}`);
    // Trong dev, tạm thời bỏ qua bước này để đơn giản

    // 4. Xóa record trong database
    await this.prisma.reviewMedia.delete({ where: { id: mediaId } });

    return { message: 'Xóa media thành công.' };
  }
}

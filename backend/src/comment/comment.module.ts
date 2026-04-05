import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository'; // ← Thêm dòng này
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, PrismaService],
  exports: [CommentService, CommentRepository],
})
export class CommentModule {}

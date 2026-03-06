import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import {PrismaModule} from "../../prisma/prisma.module";
import {OrderModule} from "../order/order.module";
import {CommentHelper} from "./comment.helper";
import {PrismaService} from "../../prisma/prisma.service";
import {OrderService} from "../order/order.service";

@Module({
  imports: [PrismaModule, OrderModule],
  controllers: [CommentController],
  providers: [CommentService, CommentHelper, PrismaService, OrderService],
  exports: [CommentService],
})
export class CommentModule {}
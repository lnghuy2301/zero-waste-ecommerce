import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {OrderService} from "../order/order.service";
import {OrderStatus} from "@prisma/client";

@Injectable()
export class CommentHelper{
    constructor(
        private readonly prisma: PrismaService,
        private readonly orderService: OrderService,
    ) {}

    async checkPurchaseHistory(userId: number, productId: number): Promise<boolean> {
        const order = await this.prisma.order.findFirst({
            where: {
                accountId: userId,
                status: OrderStatus.COMPLETED,
                orderItems: {
                    some: {
                        variant: {
                            productId: productId,
                        },
                    },
                },
            },
        });

        return !!order;
    }
}
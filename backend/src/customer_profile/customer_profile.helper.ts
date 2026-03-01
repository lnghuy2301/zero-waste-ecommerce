import {BadRequestException, ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {AccountRepository} from "../account/account.repository";
import {CustomerProfileResponseDto} from "./dto/customer_profile.response.dto";
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class CustomerProfileHelper {
    constructor(
        private prismaService: PrismaService,
        private accountRepository: AccountRepository
    ) {}

    async check_profile_account(id: number, idAccount: number): Promise<CustomerProfileResponseDto> {
        const profile = await this.prismaService.customerProfile.findUnique({
            where: {
                id: id
            }
        });

        if (!profile) {
            throw new NotFoundException("Profile không tìm thấy");
        }

        if(profile.accountId !== idAccount) {
            throw new BadRequestException('Bạn không có quyền sửa Profile của người khác');
        }
        return profile;
    }
}
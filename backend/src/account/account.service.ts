import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { AccountRequestDto } from './dto/account.request.dto';
import { AccountResponseDto } from './dto/account.response.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ResetPasswordRequestDto } from './dto/reset_password.request.dto';
import { UpdateActiveRequestDto } from './dto/update_active.request.dto';
import { UpdateRoleRequesrDto } from './dto/update_role.request.dto';
import { List_accountRequestDto } from './dto/list_account.request.dto';
import { AccountHelper } from './account.helper';
import { plainToInstance } from 'class-transformer';
import { Express } from 'express'; // Thêm dòng này

@Injectable()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private prismaService: PrismaService,
    private accountHelper: AccountHelper,
  ) {}

  async createAccount(account: AccountRequestDto): Promise<AccountResponseDto> {
    const check_email = await this.prismaService.account.findUnique({
      where: { email: account.email },
    });
    if (check_email) {
      throw new UnauthorizedException('Email đã tồn tại');
    }

    const saltRounds = 10;
    const hash_password = await bcrypt.hash(account.password, saltRounds);
    const created = await this.accountRepository.createAccount({
      ...account,
      password: hash_password,
    });
    return plainToInstance(AccountResponseDto, created);
  }

  // === HÀM XỬ LÝ UPLOAD AVATAR ===
  async uploadAvatar(id: number, file: Express.Multer.File, currentUser: any) {
    await this.accountHelper.checkSelfOrAdmin(
      currentUser.id,
      id,
      currentUser.role,
    );
    return this.accountRepository.uploadAvatar(id, file);
  }
  // ===============================

  async resetPassword(
    id: number,
    resetPassword: ResetPasswordRequestDto,
    currentUser: any,
  ) {
    await this.accountHelper.checkSelfOrAdmin(
      currentUser.id,
      id,
      currentUser.role,
    );

    const account = await this.accountHelper.check_account(id);
    const check_password = await bcrypt.compare(
      resetPassword.old_password,
      account.password,
    );
    if (!check_password) {
      throw new BadRequestException('Mật khẩu cũ sai');
    }

    if (resetPassword.new_password !== resetPassword.confirm_password) {
      throw new BadRequestException('Mật khẩu không trùng khớp');
    }
    const hash_password = await bcrypt.hash(resetPassword.confirm_password, 10);
    return this.accountRepository.updatePassword(id, hash_password);
  }

  async updateActive(
    id: number,
    updateisActive: UpdateActiveRequestDto,
  ): Promise<AccountResponseDto> {
    await this.accountHelper.check_account(id);
    await this.accountHelper.checkAdmin(id);
    return this.accountRepository.updateActive(id, updateisActive);
  }

  async updateRole(
    id: number,
    updateRole: UpdateRoleRequesrDto,
  ): Promise<AccountResponseDto> {
    await this.accountHelper.check_account(id);
    await this.accountHelper.checkAdmin(id);
    return this.accountRepository.updateRole(id, updateRole);
  }

  async statsAccount() {
    const result = await this.accountRepository.statsAccount();
    if (result === 0) {
      throw new BadRequestException('Không có tài khoản nào');
    }
    return result;
  }

  async getAccountById(
    id: number,
    currentUser: any,
  ): Promise<AccountResponseDto | null> {
    await this.accountHelper.checkSelfOrAdmin(
      currentUser.id,
      id,
      currentUser.role,
    );

    const account = await this.accountRepository.getAccountById(id);
    if (!account) {
      throw new NotFoundException('Tài khoản không tồn tại');
    }
    return account;
  }

  async getAllAccounts(currentUser: any): Promise<AccountResponseDto[]> {
    await this.accountHelper.checkAdmin(currentUser.id);
    const account = await this.accountRepository.getAllAccount();
    if (account.length == 0) {
      throw new BadRequestException('Không có tài khoản nào tồn tại');
    }
    return account;
  }

  async deleteAccountById(
    id: number,
    currentUser: any,
  ): Promise<AccountResponseDto | null> {
    await this.accountHelper.check_account(id);
    await this.accountHelper.checkSelfOrAdmin(
      currentUser.id,
      id,
      currentUser.role,
    );
    return this.accountRepository.deleteAccountById(id);
  }

  async deleteListAccount(listAccount: List_accountRequestDto) {
    const account = await this.accountRepository.deleteListAccount(listAccount);
    if (!account) {
      throw new NotFoundException(
        'Không tìm thấy tài khoản nào hợp lệ để xóa hoặc danh sách chứa Admin',
      );
    }
    return account;
  }

  // 1. HÀM QUÊN MẬT KHẨU (Gửi mail)
  async forgotPassword(email: string) {
    const account = await this.prismaService.account.findUnique({
      where: { email },
    });

    if (!account) {
      // Để bảo mật, dù không có email cũng cứ báo thành công để hacker không dò được email
      return { message: 'Nếu email tồn tại, link khôi phục đã được gửi!' };
    }

    // Tạo token ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Hash token để lưu vào DB (bảo mật hơn)
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    // Set thời gian hết hạn (ví dụ 15 phút)
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    // Lưu token vào DB
    await this.prismaService.account.update({
      where: { email },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expires,
      },
    });

    // CẤU HÌNH GỬI MAIL (Thay bằng email thật của bồ sau nhé)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tphuc290923@gmail.com',
        pass: 'alif fvzo illw ntvs',
      },
    });

    // Link dẫn tới trang Vue Frontend của bồ (kèm theo token ở trên URL)
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}&email=${email}`;

    await transporter.sendMail({
      from: '"Zero Waste Ecommerce" <no-reply@zerowaste.com>',
      to: email,
      subject: 'Yêu cầu khôi phục mật khẩu',
      html: `
        <h3>Xin chào!</h3>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng click vào link bên dưới để tạo mật khẩu mới:</p>
        <a href="${resetUrl}" style="padding: 10px 15px; background: #658a22; color: white; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
        <p><i>Link này sẽ hết hạn sau 15 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</i></p>
      `,
    });

    return { message: 'Link khôi phục đã được gửi vào email của bạn!' };
  }

  async resetPasswordWithToken(body: any) {
    const { email, token, newPassword } = body;

    // Hash lại cái token gửi từ Frontend để so với cái trong DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const account = await this.prismaService.account.findFirst({
      where: {
        email: email,
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { gt: new Date() }, // Kiểm tra token còn hạn không
      },
    });

    if (!account) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn!');
    }
    const saltRounds = 10;
    const hash_password = await bcrypt.hash(newPassword, saltRounds);

    await this.prismaService.account.update({
      where: { email },
      data: {
        password: hash_password,
        resetPasswordToken: null, // Xóa token đi
        resetPasswordExpires: null,
      },
    });

    return { message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập.' };
  }
  async getTopCustomers(currentUser: any) {
    // Chỉ Admin mới được xem thống kê này
    await this.accountHelper.checkAdmin(currentUser.id);

    const topCustomers = await this.accountRepository.getTopCustomers();

    // (Tuỳ chọn) Lọc ra những khách hàng đã có ít nhất 1 đơn hàng để bảng thống kê gọn hơn
    // const filtered = topCustomers.filter(c => c.totalOrders > 0);

    if (!topCustomers || topCustomers.length === 0) {
      throw new NotFoundException('Chưa có dữ liệu khách hàng để thống kê');
    }

    return topCustomers;
  }
}

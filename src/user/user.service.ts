import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ユーザー名変更
   * @param userId
   * @param dto
   * @returns user
   */
  async update(
    userId: number,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    delete user.password;
    return user;
  }
}

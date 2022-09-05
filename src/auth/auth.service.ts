import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { jwtToken, Message } from './types/auth.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * ユーザー登録
   * @param dto
   * @returns Message
   */
  async signUp(dto: AuthDto): Promise<Message> {
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });
      return {
        message: 'OK',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException(
            'このメールアドレスは既に登録されています',
          );
        throw error;
      }
    }
  }

  /**
   * ユーザーログイン
   * @param dto
   * @returns JwtToken
   */

  async login(dto: AuthDto): Promise<jwtToken> {
    // メールアドレスチェック
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user)
      throw new ForbiddenException(
        'メールアドレス・パスワードが正しくありません',
      );

    // パスワードチェック
    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid)
      throw new ForbiddenException(
        'メールアドレス・パスワードが正しくありません',
      );

    // トークン生成
    const token = this.generateJwt(user.id, user.email);

    return token;
  }

  /**
   * JWTトークンを生成
   * @param userId
   * @param email
   * @returns JwtToken
   */
  async generateJwt(userId: number, email: string): Promise<jwtToken> {
    const payload = {
      id: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '5m',
      secret,
    });

    return {
      accessToken: token,
    };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let jwt = null;
          if (req && req.cookies) jwt = req.cookies['access_token'];
          return jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: { id: number; email: string }) {
    const { id } = payload;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new UnauthorizedException();

    delete user.password;
    return user;
  }
}

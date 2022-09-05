import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getUser(@Req() req: Request): Omit<User, 'password'> {
    return req.user;
  }

  @Patch()
  async updateUserName(@Req() req: Request, @Body() dto: UpdateUserDto) {
    return this.userService.update(req.user.id, dto);
  }
}

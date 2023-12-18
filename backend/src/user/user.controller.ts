import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/:userId')
  async getAllUsers(@Param('userId') userId: string) {
    // console.log(userId)
    return this.userService.findAllUsers(Number(userId));
  }
  @Get('other/:userId')
  async findAautherUsers(@Param('userId') userId: string) {
    // console.log(userId)
    return this.userService.findAautherUsers(Number(userId));
  }
  @Get('one/:userName/:userId')
  async getOneUsers(
    @Param('userName') userName: string,
    @Param('userId') userId,
  ) {
    // console.log('userId--->', userId);
    // console.log('userName--->', userName);
    return this.userService.findOneUsers(Number(userId), userName);
  }
  @Post('update_info/:userId')
  async update_name(@Body() bd: any, @Param('userId') userId: string) {
    return this.userService.apdate_user(
      Number(userId),
      bd.username,
      bd.foto_user,
      bd.email,
    );
  }
  @Get('getbyuserid/:userId')
  async getByUserId(@Param('userId') userId: string) {
    // console.log('userId--->', userId);
    // console.log('userName--->', userName)
    return this.userService.findByUserId(Number(userId));
  }
  @Post('enable-2fa/:userId')
  async enableTwoFactor(@Param('userId') userId: string) {
    // Assuming user is authenticated
    const secret = await this.userService.enableTwoFactor(Number(userId));

    return {
      message: 'Two-Factor Authentication enabled',
      secret,
    };
  }
  @Post('DeactivateTwoFactor/:userId')
  async DeactivateTwoFactor(@Param('userId') userId: string) {
    // Assuming user is authenticated
    const secret = await this.userService.DeactivateTwoFactor(Number(userId));

    return {
      message: 'Two-Factor Authentication enabled',
      secret,
    };
  }
}

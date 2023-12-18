import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { roomDto } from '../dto/game';

@Controller('game/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }
  @Get('/:userId')
  async getRoom(@Param('userId') userId: string) {
    return this.roomService.getRoom(Number(userId));
  }
  @Post('/:userId')
  async creatRoom(@Param('userId') userId: string, @Body() body: roomDto) {
    return this.roomService.creatRoom(Number(userId), body);
  }
  @Delete('/:userId')
  async deleteRoom(@Param('userId') userId: string) {
    return this.roomService.deleteRoom(Number(userId));
  }
}

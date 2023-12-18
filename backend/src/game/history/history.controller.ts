import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { historyDto } from '../dto/game'
import { HistoryService } from './history.service';
@Controller('game/history')
export class HistoryController {

    constructor(private readonly updateService: HistoryService) { }
    @Post(':id')
    async updateUsershistory(@Param('id') userid: string, @Body() body: historyDto) {
        return this.updateService.updateUsershistory(Number(userid), body)
    }

    @Get(':id')
    async getUsershistory(@Param('id') userid: string,) {
        return this.updateService.getUsershistory(Number(userid))
    }
    @Get(':id/:customid')
    async getUsersCustomhistory(@Param('id') userid: string, @Param('customid') customid: string) {
        return this.updateService.getUsersCustomhistory(Number(userid), Number(customid))
    }
    @Delete(':id')
    async clearUsershistory(@Param('id') userid: string,) {
        return this.updateService.clearUsershistory(Number(userid))
    }
    @Delete(':id/:customid')
    async clearUsersCustomhistory(@Param('id') userid: string, @Param('customid') customid: string) {
        return this.updateService.clearUsersCustomhistory(Number(userid), Number(customid))
    }
}

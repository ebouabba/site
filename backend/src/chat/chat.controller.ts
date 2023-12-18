import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {

    constructor(private chatService: ChatService) {
    }

    @Post('createChannel/:idUser')
    async CreateChannel(@Body() body, @Param('idUser') idUser: number) {
        await this.chatService.createChannel(body, Number(idUser))
    }

    @Post('joinChannel/:idUser/:idRoom')
    async JoinChannel(@Param('idUser') idUser: number, @Param('idRoom') idRoom: number) {
        await this.chatService.joinChannel(Number(idUser), Number(idRoom))
    }

    @Get('allChannelByUserId/:idUser')
    async GetAllChannelByUserId(@Param('idUser') idUser: number) {
        return await this.chatService.getAllChannelByUserId(Number(idUser));
    }

    @Post('sendMessageToChannel/:idRoom/:idUser')
    async SendMessageToChannel(@Body() body, @Param('idRoom') idRoom: number, @Param('idUser') idUser: number) {
        await this.chatService.sendMessageToChannel(body, Number(idRoom), Number(idUser))
    }

    @Get('allMessagesChannel/:idUser/:idRoom')
    async GetallMessagesChannel(@Param('idUser') idUser: number, @Param('idRoom') idRoom: number) {
        return await this.chatService.getallMessagesChannel(Number(idUser), Number(idRoom))
    }

    @Post('directMessage/:idSender/:idReceiver')
    async SendDirectMessage(@Body() body, @Param('idSender') idSender: number, @Param('idReceiver') idReceiver: number) {
        console.log("hana hana");
        await this.chatService.sendDirectMessage(body, Number(idSender), Number(idReceiver))
    }

    @Get('getConversationDirect/:idSender/:idReceiver')
    async GetConversationDirect(@Param('idSender') idSender: number, @Param('idReceiver') idReceiver: number) {
        console.log("hana hana");
        return await this.chatService.getConversationDirect(Number(idSender), Number(idReceiver))
    }

    @Delete('deleteConversationDirect/:idSender/:idReceiver')
    async DeleteConversationDirect(@Param('idSender') idSender: number, @Param('idReceiver') idReceiver: number) {
        await this.chatService.deleteConversationDirect(Number(idSender), Number(idReceiver))
    }
    @Get('getConversationListDirect/:idUser/:type')
    async GetConversationListDirect(@Param('idUser') idUser: number, @Param('type') type: string) {
        return await this.chatService.getConversationListDirect(Number(idUser), type)
    }
}

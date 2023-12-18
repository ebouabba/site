import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { exit } from 'process';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';


export interface userProps {

  id: number,
  createdAt: string,
  updatedAt: string,
  email: string,
  hash: string,
  username: string,
  firstName: string,
  lastName: string,
  foto_user: string,
  isOnline: boolean,
  userId: number
  room: string
}
@WebSocketGateway(
  {
    cors: {
      origin: '*'
    },
    namespace: 'OnlineGateway'
  }
)
export class OnlineGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private onlineUsers: Map<Socket, number> = new Map();
  constructor(private prisma: PrismaService) { }
  private searchForOpponent: Map<Socket, userProps> = new Map();
  userInGame: Map<number, Socket> = new Map()
  async handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    if (userId < 1)
      return
    this.onlineUsers.set(client, userId);
    const myset: Set<number> = new Set();
    Array.from(this.onlineUsers).map((item) => myset.add(item[1]))
    this.server.emit('updateOnlineUsers', Array.from(myset));
    // console.log(Array.from(myset))
  }
  async handleDisconnect(client: Socket) {
    try {
      this.matchingRoom.forEach((value, index) => {
        if (value.socketplayer1 == client || value.socketplayer2 == client) {
          value.socketplayer1.emit('withdrawalFromMatching');
          value.socketplayer2.emit('withdrawalFromMatching');
          this.searchForOpponent.delete(client)
          this.matchingRoom.splice(index, 1)
        }
      })
      this.searchForOpponent.delete(client)
      const userid = this.onlineUsers.get(client)
      this.onlineUsers.delete(client);
      const myset: Set<number> = new Set();
      Array.from(this.onlineUsers).map((item) => myset.add(item[1]))
      this.server.emit('updateOnlineUsers', Array.from(myset));
      if (this.userInGame.get(userid)) {
        if (this.userInGame.get(userid).id == client.id) {
          // console.log('remove client from game', userid)

          await this.prisma.user.update({
            where: { id: userid },
            data: {
              room: '',
              isOnline: false
            }
          })
        }
        this.userInGame.delete(userid)
      } {
        await this.prisma.user.update({
          where: { id: userid },
          data: {
            room: '',
            isOnline: false
          }
        })

      }
    } catch (error) {

    }
  }
  @SubscribeMessage('userjointToGame')
  handleuserjointToGame(client: Socket, { userId }) {
    if (userId < 1)
      return
    if (!this.userInGame.get(userId)) {
      // console.log('userjointToGame:', userId, client.id)
      this.userInGame.set(userId, client)
    }
  }
  @SubscribeMessage('DeleteuserFromGame')
  async handleDeleteUserFromGame(client: Socket, { userId }) {
    if (userId < 1)
      return
    if (this.userInGame.get(userId)) {
      if (this.userInGame.get(userId).id == client.id) {
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            room: '',
            isOnline: false
          }
        })
        this.userInGame.delete(userId)
        // console.log('remove client from game', userId)
      }
    }
  }


  @SubscribeMessage('areYouReady')
  handleAreYouReady(client: Socket, { OpponentId, currentPlayer, room }: { OpponentId: string, currentPlayer: userProps, room: string }): void {
    this.onlineUsers.forEach((value: any, key: any) => {
      if (value == OpponentId) {
        key.emit("areYouReady", { OpponentId, currentPlayer, room })
      }
    })
  }
  @SubscribeMessage('rejectRequest')
  handlerejectRequest(client: Socket, { currentUser, opponent }: { currentUser: userProps, opponent: userProps }): void {
    this.onlineUsers.forEach((value: any, key: any) => {
      if (value == opponent.id) {
        key.emit("rejectRequest")
      }
    })
  }

  @SubscribeMessage('rejectAcceptRequesthidden')
  handlrejectAcceptRequesthidden(client: Socket, { currentUser }: { currentUser: userProps }): void {
    this.onlineUsers.forEach((value: any, key: any) => {
      if (value == currentUser.id) {
        key.emit("rejectAcceptRequesthidden")
      }
    })
  }
  private matchingRoom: Array<{ socketplayer1: Socket, player1: userProps, p1IsStart: boolean, socketplayer2: Socket, player2: userProps, p2IsStart: boolean }> = new Array();
  @SubscribeMessage('searchForOpponent')
  handelSearchForOpponent(client: Socket, { currentUser }: { currentUser: userProps }): void {
    if (currentUser.id < 1)
      return
    try {
      this.searchForOpponent.forEach((user_value: any, sock_key: any) => {
        if (currentUser.id == user_value.id) {
          throw new Error('ExitLoopException');
        }
      })
      if (currentUser.username != '' && client != undefined) {
        this.searchForOpponent.set(client, currentUser)
        this.searchForOpponent.forEach((user_value: any, sock_key: any) => {
          if (currentUser.id != user_value.id) {
            sock_key.emit('searchForOpponent', currentUser)
            client.emit('searchForOpponent', user_value)
            this.matchingRoom.push({ socketplayer1: client, player1: user_value, p1IsStart: false, socketplayer2: sock_key, player2: currentUser, p2IsStart: false })
            throw new Error('ExitLoopException');
          }
        })
      }
    } catch (error) {
    }
  }
  @SubscribeMessage('deleteFromsearchForOpponent')
  handeldeleteFromsearchForOpponent(client: Socket): void {
    this.searchForOpponent.delete(client)
  }
  @SubscribeMessage('withdrawalFromMatching')
  handelwithdrawalFromMatching(client: Socket): void {
    this.matchingRoom.forEach((value, index) => {
      if (value.socketplayer1 == client || value.socketplayer2 == client) {
        value.socketplayer1.emit('withdrawalFromMatching');
        value.socketplayer2.emit('withdrawalFromMatching');
        this.searchForOpponent.delete(client)
        this.matchingRoom.splice(index, 1)
      }
    })
  }
  @SubscribeMessage('JoinMatch')
  handleDisconnecta(client: Socket) {
    this.matchingRoom.forEach((value, index) => {
      if (value.socketplayer2 == client) {
        value.socketplayer1.emit('JoinMatch');
        if (value.p1IsStart == true)
          value.socketplayer2.emit('JoinMatch');
        value.p2IsStart = true
      }
      else if (value.socketplayer1 == client) {
        value.socketplayer2.emit('JoinMatch');
        if (value.p2IsStart == true)
          value.socketplayer1.emit('JoinMatch');
        value.p1IsStart = true
      }
      if (value.p1IsStart == true && value.p2IsStart == true) {
        this.searchForOpponent.delete(value.socketplayer1)
        this.searchForOpponent.delete(value.socketplayer2)
      }
    })
  }
}

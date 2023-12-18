import { UserService } from '../user/user.service';

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { RoomService } from './room/room.service';
import { HistoryService } from './history/history.service';
import { historyDto } from './dto/game';
import { userProps } from 'src/online/online.gateway';
import { BALL, Canvas, Game, Player } from './interface';
import { GameService } from './game.service';
import { AchievementService } from './achievement/achievement.service';

@WebSocketGateway(
  {
    cors: {
      origin: '*'
    },
    namespace: 'gameGateway'
  }
)
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private userService: UserService,
    private roomService: RoomService,
    private gameService: GameService,
    private gameHistory: HistoryService,
    private achievementService: AchievementService

  ) { }
  @WebSocketServer()
  server: Server;

  IdOfPlayer: Map<Socket, number> = new Map<Socket, number>();
  players: Array<{ _client: Socket; _room: string, user_id: number }> = [];
  rooms: Map<string, number> = new Map<string, number>();
  ballPosition: Map<string, { x: number, y: number }> = new Map<string, { x: number, y: number }>();
  matchs: Map<string, number> = new Map<string, number>();

  games: Map<string, Game> = new Map<string, Game>();

  async handleConnection(client: Socket) {
    try {
      const userId = Number(client.handshake.query.userId);
      if (userId < 1) return;
      this.IdOfPlayer.set(client, userId);
    } catch (error) { }
  }

  async handleDisconnect(client: Socket) {
    try {
      const user = this.players.find((item) => item._client.id == client.id);
      this.players = this.players.filter(
        (item) => item._client.id != client.id,
      );
      if (user) {
        client.to(user._room).emit('leaveRoom');
        await this.roomService.deleteRoom(this.IdOfPlayer.get(client));
        this.rooms.delete(user._room);
        this.IdOfPlayer.delete(client);
        const game = this.games.get(user._room)
        game.gameFinish = false
        this.games.delete(user._room)
        // return
        if (game) {
          console.log('hona-------------11', game.player1_Id, game.player2_Id)
          this.leaveTheGame({ game: game, userid: user.user_id })
        }

        // console.log('hona-------------12', user.user_id)
      }
    } catch (error) { }
  }

  async leaveTheGame({ game, userid }) {
    try {
      const opponentid = game.player1_Id == userid ? game.player2_Id : game.player1_Id
      console.log('gmae status', game.status)
      if (game.player1.status == '' && game.player2.status == '' && game.status != 'Pause') {
        console.log('d5al', game.status)
        game.player1_Id = -1
        game.player2_Id = -1
        await this.gameHistory.updateUsershistory(userid, {
          opponentId: opponentid,
          status: 'lost',
          myGools: 0,
          opponentGools: 3
        })
        await this.gameHistory.updateUsershistory(opponentid, {
          opponentId: userid,
          status: 'won',
          myGools: 3,
          opponentGools: 0
        })
        await this.achievementService.updateLevel(userid, { points: 5, status: 'lost' })
        await this.achievementService.updateLevel(opponentid, { points: 60, status: 'won' })
      }
    } catch (error) {
    }

  }
  @SubscribeMessage('documentHidden')
  handleMessage(client: Socket, flag: boolean): void {
    const user = this.players.find((item) => item._client.id == client.id);
    if (user) {
      client.to(user._room).emit('documentHidden', flag);
    }
  }

  @SubscribeMessage('joinRoom')
  async handleCreatRoom(client: Socket, { room, userId, opponentId }) {
    if (room == '' || this.rooms.get(room) == 2)
      return
    try {
      this.players.forEach((value, key) => {
        if (value.user_id == userId)
          throw new Error('ExitLoopException');
      })
      if (!this.rooms.get(room)) {
        this.rooms.set(room, 1);
      } else {
        this.rooms.set(room, this.rooms.get(room) + 1);
      }
      this.players.push({ _client: client, _room: room, user_id: userId });
      const content = await this.userService.makeUserInGame(userId);
      client.join(room);

      const index = this.players.findIndex(
        (item) => item._client.id === client.id,
      );
      if (this.rooms.get(room) == 2) {
        const canvasWidth = 900
        const canvasHeight = 450
        const playerHeight = 100
        const playerWidth = 20
        const player1 = new Player(0, canvasHeight / 2 - playerHeight / 2, 20, 100, 'player1')
        const player2 = new Player(canvasWidth - 20, canvasHeight / 2 - playerHeight / 2, 20, 100, 'player2')
        const ball = new BALL({ ballX: 200, ballY: 200, velocityX: 8, velocityY: 6, acceLeration: 0.5, speeD: 10, raduis: 15 })
        const canvas = new Canvas({ width: canvasWidth, height: canvasHeight, velocityX: 8, velocityY: 6, speeD: 10 })
        this.games.set(room, {
          proteted: false,
          status: 'Resume',
          gameId: 0,
          player1: player1,
          player2: player2,
          player1_Id: userId,
          player2_Id: opponentId,
          gameFinish: true,
          Ball: ball,
          canvas: canvas,
          score: 3
        })
        const game = this.games.get(room)
        this.server.to(room).emit('initGame', JSON.stringify({
          game: game,
          type: 'update',
        }));
        game.gameId = setInterval(() => {
          if (!game.gameFinish)
            clearInterval(game.gameId)
          if (game.status == 'Pause' || game.player1.pause || game.player2.pause)
            return
          this.gameService.updateGame({ game: game, room: room, server: this.server })
          this.gameService.checkIfgameOver({ game: game })
          if (game.player1.status != '' && game.player2.status != '')
            this.updateHistory({ game: game })
          this.server.to(room).emit('updateGame', JSON.stringify({
            game: game,
            type: 'update',
          }));
        }, 1000 / 60);
      }
    } catch (error) {

    }
  }
  async updateHistory({ game }: { game: Game }) {
    try {
      // console.log(game.player1_Id, game.player1.status, game.player1.score)
      // console.log(game.player2_Id, game.player2.status, game.player2.score)
      await this.gameHistory.updateUsershistory(game.player1_Id, {
        opponentId: game.player2_Id,
        status: game.player1.status,
        myGools: game.player1.score,
        opponentGools: game.player2.score
      })
      await this.gameHistory.updateUsershistory(game.player2_Id, {
        opponentId: game.player1_Id,
        status: game.player2.status,
        myGools: game.player2.score,
        opponentGools: game.player1.score
      })
      await this.achievementService.updateLevel(game.player1_Id, { points: game.player1.points, status: game.player1.status })
      await this.achievementService.updateLevel(game.player2_Id, { points: game.player2.points, status: game.player2.status })
    } catch (error) {
    }

  }
  @SubscribeMessage('MouseMove')
  handleMouseMove(client: Socket, { newPositionX, newPositionY, room, userid }) {
    const game = this.games.get(room)
    if (game) {
      if (userid == game.player2_Id)
        game.player1.y = newPositionY
      else if (userid == game.player1_Id)
        game.player2.y = newPositionY
    }
  }
  @SubscribeMessage('joinMatch')
  handleCreatMatch(client: Socket, { room, userId }): void {
    if (!this.matchs.get(room)) {
      this.matchs.set(room, 1);
    } else {
      this.matchs.set(room, this.matchs.get(room) + 1);
    }
    this.players.push({ _client: client, _room: room, user_id: userId });
    client.join(room);

    const index = this.players.findIndex(
      (item) => item._client.id === client.id,
    );
    if (this.matchs.get(room) == 1) this.server.to(room).emit('onePlayerR');
    if (this.matchs.get(room) == 2) this.server.to(room).emit('towPlayerR');
  }


  @SubscribeMessage('playAgain')
  handlePlayAgain(client: Socket, { room, userId }): void {
    const game = this.games.get(room)
    if (!game)
      return
    if (game.player1_Id == userId)
      game.player1.status = ''
    if (game.player2_Id == userId)
      game.player2.status = ''
    // console.log('play', game.player1.status, game.player2.status)
    if (game.player1.status == '' && game.player2.status == '') {
      game.player1.score = 0
      game.player2.score = 0
      game.Ball.ballX = game.canvas.width / 2
      game.Ball.ballY = game.canvas.height / 2
      game.status = 'resume'
      this.server.to(room).emit('playAgainIsDone')
    }
  }

  @SubscribeMessage('startWithComputer')
  handlestartWithComputer(client: Socket): void {
    client.emit('start');
  }

  @SubscribeMessage('ResumePause')
  handlegameResumePause(client: Socket, { room, userId }): void {
    const game = this.games.get(room)
    if (!game)
      return
    if (game.status == 'Pause')
      return
    if (game.player1_Id == userId) {
      if (!game.player2.pause)
        game.player1.pause = !game.player1.pause
    } else if (game.player2_Id == userId) {
      if (!game.player1.pause)
        game.player2.pause = !game.player2.pause
    }
  }

}

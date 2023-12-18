import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*'
  }, namespace: 'ChatGateway'
})

export class ChatGateway {

  listId: Map<Socket, number> = new Map()

  handleConnection(client: Socket) {
    if (Number(client.handshake.query.userId) == 0)
      return
    console.log(client.handshake.query.userId, 'connect')
    this.listId.set(client, Number(client.handshake.query.userId))
    let a = this.listId.get(client);
  }

  handleDisconnect(client: Socket) {
    if (Number(client.handshake.query.userId) == 0)
      return
    console.log(client.handshake.query.userId, 'disconnect')
    this.listId.delete(client)
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, data: any) {
    console.log(data)
    this.listId.forEach((value, socket) => {
      console.log(`${value} == ${data.senderId}`)
      if ((value == data.ReceiverId) && data.content)
        socket.emit('message', data)
    })

  }
}

import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true, namespac: '/' })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    console.log({payload});
    console.log(token);
    // console.log(client);
    // console.log('Client connected', client.id);

    // console.log({conectados: this.messagesWsService.getConnectClients()});

    // Unir el cliente a una sala
    // client.join('ventas');
    // client.join(client.id);
    // client.join(user.email);
    // // Enviar un mensaje a la sala
    // this.wss.to('ventas').emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: 'Hola a todos!!',
    // });

    this.wss.emit('clients_updated', this.messagesWsService.getConnectClientsId());
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected', client.id);
    this.messagesWsService.removeClient(client.id);
    // console.log({conectados: this.messagesWsService.getConnectClients()});
    this.wss.emit('clients_updated', this.messagesWsService.getConnectClientsId());
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto): void {
    console.log(client.id, payload);
  
    //! Emite únicamente al cliente.
  // client.emit('message-from-server', {
  //   fullName: 'Soy Yo!',
  //   message: payload.message || 'no-message!!',
  // });

    //! Emite a todos MENOS, al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message!!',
    // });

    //! Emite a todos los clientes
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!',
    });
  }
  


}

import { IncomingData, IncomingUser } from '../types/incomingData';
import { registerUsers } from '../users/users';
import { Command } from '../types/command';
import { RoomsController } from '../room/rooms';
import WebSocketExt from '../types/websocketExt';

export class WSController {
  message: IncomingData;
  data: IncomingUser;
  ws: WebSocketExt;

  constructor(ws: WebSocket, message: IncomingData) {
    this.message = message;
    this.data = this.message.data as IncomingUser;
    this.ws = ws;
  }

  checkCommand() {
    switch (this.message.type) {
      case Command.Reg:
        registerUsers(this.ws, this.data as IncomingUser);
        console.log('User registered');
        break;
      case Command.CreateRoom:
        console.log('Room %s', this.data, this.ws.id);
        new RoomsController(this.ws).updateRoom();
        break;
    }
  }
}

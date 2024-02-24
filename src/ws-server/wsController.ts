import { IncomingData, IncomingUser } from '../types/incomingData';
import { registerUsers } from '../users/users';
import { Command } from '../types/command';

export class WSController {
  message: IncomingData;
  data: IncomingUser;
  ws: WebSocket;

  constructor(ws: WebSocket, message: IncomingData) {
    this.message = message;
    this.data = this.message.data;
    this.ws = ws;
  }

  checkCommand() {
    switch (this.message.type) {
      case Command.Reg:
        registerUsers(this.ws, this.data as IncomingUser);
        console.log('User registered');
        break;
    }
  }
}

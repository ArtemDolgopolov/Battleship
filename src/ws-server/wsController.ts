import { IncomingData, IncomingRoom, IncomingUser } from '../types/incomingData';
import { registerUsers } from '../users/users';
import { Command } from '../types/command';
import { RoomsController } from '../room/rooms';
import WebSocketExt from '../types/websocketExt';

export class WSController {
  message: IncomingData;
  data: IncomingUser | IncomingRoom;
  ws: WebSocketExt;
  roomsController: RoomsController;

  constructor(ws: WebSocket, message: IncomingData) {
    this.message = message;
    this.data = this.message.data;
    this.ws = ws;
    this.roomsController = new RoomsController(this.ws);
  }

  checkCommand() {
    switch (this.message.type) {
     case Command.Reg:
       registerUsers(this.ws, this.data as IncomingUser);
       this.roomsController.updateCurrentRoom();
       console.log('User registered');
       break;

     case Command.CreateRoom:
       this.roomsController.updateRoom();
       console.log('Room added');
       break;
     case Command.AddUserToRoom:
       this.roomsController.createGame(this.data as IncomingRoom);
       this.roomsController.updateCurrentRoom();
       break;
    }
  }
}

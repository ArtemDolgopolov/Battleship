import { IncomingData, IncomingRoom, IncomingUser, UserShips } from '../types/incomingData';
import { registerUsers } from '../users/users';
import { Command } from '../types/command';
import { RoomsController } from '../room/rooms';
import WebSocketExt from '../types/websocketExt';
import { GameController } from '../game/gameController';

export class WSController {
  message: IncomingData;
  data: IncomingUser | IncomingRoom | UserShips;
  ws: WebSocketExt;
  roomsController: RoomsController;
  gameController: GameController

  constructor(ws: WebSocket, message: IncomingData) {
    this.message = message;
    this.data = this.message.data;
    this.ws = ws;
    this.roomsController = new RoomsController(this.ws);
    this.gameController = new GameController(this.ws);
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
     case Command.AddShips:
       this.gameController.startGame(this.data as UserShips);
       console.log('Shipps added');
       break;
    }
  }
}

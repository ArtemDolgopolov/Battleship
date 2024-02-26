import { AttackUser, IncomingData, IncomingRoom, IncomingUser, RandomAttack, UserShips } from '../types/incomingData';
import { registerUsers } from '../users/users';
import { Command } from '../types/command';
import WebSocketExt from '../types/websocketExt';
import { RoomsController } from '../room/rooms';
import { GameController } from '../game/gameController';

export class WSController {
  message: IncomingData;
  data: IncomingUser | IncomingRoom | UserShips | AttackUser | RandomAttack;
  ws: WebSocketExt;
  roomsController: RoomsController;
  gameController: GameController;

  constructor(ws: WebSocketExt, message: IncomingData) {
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
        this.roomsController.updateWinners();
        console.log('User registered');

        break;

      case Command.CreateRoom:
        this.roomsController.updateRoom();
        console.log('Room added');
        break;

      case Command.AddUserToRoom:
        this.roomsController.createGame(this.data as IncomingRoom);
        this.roomsController.updateCurrentRoom();
        console.log('Game created');
        break;

      case Command.AddShips:
        this.gameController.startGame(this.data as UserShips);
        console.log('Shipps added');
        break;

      case Command.Attack:
        this.gameController.attackControl(this.data as AttackUser);
        console.log('The attack happened');
        break;

      case Command.RundomAttack:
        this.gameController.getRandomAttack(this.data as RandomAttack);
        console.log('Random attack happened');
        break;

      case Command.SinglePlay:
        this.roomsController.createGameWithBot();
        this.roomsController.updateCurrentRoom();
        console.log('Single game was created');
        break;

      default:
        console.error('Invalid message type');
        break;
    }
  }
}

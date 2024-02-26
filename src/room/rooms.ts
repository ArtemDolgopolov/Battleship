import { games, rooms, winners } from '../data/gameData';
import { Command } from '../types/command';
import { IncomingRoom } from '../types/incomingData';
import WebSocketExt from '../types/websocketExt';
import { userDB, wsClients } from '../data/userData';
import { GameInfo } from '../types/types';
import { shippForBot } from '../data/shipsForBot';
import { GameService } from '../game/gameService';

let roomId = 0;
export let idGame = 0;

export class RoomsController {
  ws: WebSocketExt;
  gameService: GameService;

  constructor(ws: WebSocketExt) {
    this.ws = ws;
    this.gameService = new GameService();
  }

  private createRoom() {
    if (typeof this.ws.id === 'number' && typeof this.ws.indexSocket === 'number') {
      if (this.checkUserRooms() || this.checkUserGame()) {
        return undefined;
      }
      const newRoom = {
        roomId: roomId,
        indexSocket: this.ws.indexSocket,
        roomUsers: [
          {
            name: userDB[this.ws.id].name,
            index: this.ws.id,
          },
        ],
      };
      roomId++;
      rooms.push(newRoom);
      return rooms;
    }
  }

  createGame(data: IncomingRoom) {
    const searchRoom = rooms.find((room) => room.roomId === data.indexRoom);
    if (searchRoom && typeof this.ws.id === 'number' && typeof this.ws.indexSocket === 'number') {
      if (this.ws.id === searchRoom.roomUsers[0].index || this.checkUserGame()) {
        return;
      }
      const newGame: GameInfo = {
        idGame: idGame,
        players: [
          {
            idPlayer: 0,
            idUser: this.ws.id,
            indexSocket: this.ws.indexSocket,
            shipInfo: [],
            shipsCoord: [],
            isGoes: true,
            checkWin: 0,
          },
          {
            idPlayer: 1,
            idUser: searchRoom.roomUsers[0].index,
            indexSocket: searchRoom.indexSocket,
            shipInfo: [],
            shipsCoord: [],
            isGoes: false,
            checkWin: 0,
          },
        ],
      };

      games.set(newGame.idGame, newGame);
      this.deleteRoom(data.indexRoom);
      this.deleteRoomByUserId(this.ws.id);
      this.sendCreateGame(idGame, this.ws.id, newGame.players[0].idPlayer);
      this.sendCreateGame(idGame, searchRoom.roomUsers[0].index, newGame.players[1].idPlayer, searchRoom.indexSocket);
      idGame++;
    }
  }

  createGameWithBot() {
    if (typeof this.ws.id === 'number' && typeof this.ws.indexSocket === 'number') {
      if (this.checkUserGame()) {
        return;
      }
      const shipsBot = shippForBot[Math.floor(Math.random() * shippForBot.length)];
      const newGame: GameInfo = {
        idGame: idGame,
        isbot: true,
        players: [
          {
            idPlayer: 0,
            idUser: this.ws.id,
            indexSocket: this.ws.indexSocket,
            shipInfo: [],
            shipsCoord: [],
            isGoes: true,
            checkWin: 0,
          },
          {
            idPlayer: 1,
            idUser: -1,
            indexSocket: -1,
            shipInfo: this.gameService.addShips(shipsBot),
            shipsCoord: shipsBot,
            isGoes: false,
            checkWin: 0,
          },
        ],
      };

      games.set(newGame.idGame, newGame);
      this.deleteRoomByUserId(this.ws.id);
      this.sendCreateGame(idGame, this.ws.id, newGame.players[0].idPlayer);
      idGame++;
    }
  }

  private sendCreateGame(idGame: number, idUser: number, idPlayer: number, indexSocket?: number) {
    const wsClientsArray = Array.from(wsClients);

    const findClient = idUser !== this.ws.id ? wsClientsArray.find((ws) => ws.indexSocket === indexSocket) : this.ws;

    const sendData = {
      idGame: idGame,
      idPlayer: idPlayer,
    };

    const res = {
      type: Command.CreateGame,
      data: JSON.stringify(sendData),
      id: 0,
    };

    findClient?.send(JSON.stringify(res));
  }

  private deleteRoom(idRoom: number) {
    const searchIndex = rooms.findIndex((room) => room.roomId === idRoom);
    if (searchIndex !== -1) {
      rooms.splice(searchIndex, 1);
    }
  }

  private deleteRoomByUserId(userId: number) {
    const searchIndexRoomByUserId = rooms.findIndex((user) => {
      return user.roomUsers[0].index === userId;
    });

    if (searchIndexRoomByUserId !== -1) {
      rooms.splice(searchIndexRoomByUserId, 1);
    }
  }

  updateRoom() {
    const room = this.createRoom();

    if (room) {
      const res = {
        type: Command.UpdateRoom,
        data: JSON.stringify(
          room.map((room) => {
            const { indexSocket, ...rest } = room;
            return rest;
          }),
        ),
        id: 0,
      };
      wsClients.forEach((client) => {
        client.send(JSON.stringify(res));
      });
    }
  }

  updateCurrentRoom() {
    const res = {
      type: Command.UpdateRoom,
      data: JSON.stringify(
        rooms.map((room) => {
          const { indexSocket, ...rest } = room;
          return rest;
        }),
      ),
      id: 0,
    };
    wsClients.forEach((client) => {
      client.send(JSON.stringify(res));
    });
  }

  updateWinners() {
    const res = {
      type: Command.UpdateWin,
      data: JSON.stringify(winners),
      id: 0,
    };
    wsClients.forEach((client) => {
      client.send(JSON.stringify(res));
    });
  }

  private checkUserRooms() {
    const checkRoom = rooms.find((room) => {
      return room.roomUsers.some((user) => this.ws.id === user.index);
    });
    if (checkRoom) {
      return true;
    }
    return false;
  }

  private checkUserGame() {
    const gamesArray = Array.from(games.values());
    const checkRoom = gamesArray.find((room) => {
      return room.players.some((user) => this.ws.id === user.idUser);
    });
    if (checkRoom) {
      return true;
    }
    return false;
  }
}

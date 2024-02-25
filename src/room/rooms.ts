import { Command } from '../types/command';
import { IncomingRoom } from '../types/incomingData';
import WebSocketEx from '../types/websocketExt';
import { userDB, wsClients } from '../data/userData';
import { games, rooms } from '../data/gameData';
import { GameInfo } from '../types/types';

let roomId = 0;

export let idGame = 0;

export class RoomsController {
  ws: WebSocketEx;

  constructor(ws: WebSocketEx) {
    this.ws = ws;
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
   if (searchRoom && typeof this.ws.id === 'number') {
     if (this.ws.id === searchRoom.roomUsers[0].index || this.checkUserGame()) {
       return;
     }
     const newGame: GameInfo = {
       idGame: idGame,
       players: [
        {
          idPlayer: this.ws.id,
          indexSocket: this.ws.indexSocket,
          shipInfo: [],
          shipsCoord: [],
          checkWin: 0,
        },
        {
          idPlayer: searchRoom.roomUsers[0].index,
          indexSocket: searchRoom.indexSocket,
          shipInfo: [],
          shipsCoord: [],
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
      data: JSON.stringify(rooms),
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
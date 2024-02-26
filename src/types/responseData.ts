import { StatusAttack } from './command';
import { ShipsCoord } from './incomingData';

export interface ResponseUser extends ResponseUserInfo {
  error: boolean;
  errorText: string;
}

export interface RoomGame {
  roomId: number;
  indexSocket: number;
  roomUsers: ResponseUserInfo[];
}

interface ResponseUserInfo {
  name: string;
  index: number;
}

export interface CreateGame {
  idGame: number;
  idPlayer: number;
}

export interface StartGameData {
  ships: ShipsCoord[];
  currentPlayerIndex: number;
}

export interface AttackStatus {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: number;
  status: StatusAttack;
}

export interface Winner {
  name: string;
  wins: number;
}

export interface WinnerId {
  winPlayer: number;
}

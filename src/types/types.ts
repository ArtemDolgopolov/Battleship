import { ShipsCoord } from './incomingData';

export interface User {
  name: string;
  password: string;
  index: number;
}

export interface GameInfo {
  idGame: number;
  isbot?: true;
  players: PlayerInfo[];
}

interface PlayerInfo {
  idPlayer: number;
  idUser: number;
  indexSocket: number;
  shipInfo: Array<number[]>;
  shipsCoord: ShipsCoord[];
  isGoes: boolean;
  checkWin: number;
}

export interface Coordinate {
  x: number;
  y: number;
}

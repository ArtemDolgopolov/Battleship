import { ShipsCoord } from './incomingData';

export interface User {
  name: string;
  password: string;
  index: number;
}

export interface GameInfo {
 idGame: number;
 players: PlayerInfo[];
}

interface PlayerInfo {
 idPlayer: number;
 indexSocket: number;
 shipInfo: Array<number[]>;
 shipsCoord: ShipsCoord[];
 checkWin: number;
}
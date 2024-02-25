import { ShipsCoord } from './incomingData';

export interface ResponseUser extends ResponseUserInfo {
 error: boolean;
 errorText: string;
}

export interface StartGameData {
  ships: ShipsCoord[];
  currentPlayerIndex: number;
}

export interface RoomGame {
 roomId: number;
 roomUsers: ResponseUserInfo[];
 indexSocket: number;
}

interface ResponseUserInfo {
 name: string;
 index: number;
}

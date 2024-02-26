import { Winner, RoomGame } from '../types/responseData';
import { GameInfo } from '../types/types';

export const games: Map<number, GameInfo> = new Map();

export const rooms: RoomGame[] = [];

export const winners: Winner[] = [];
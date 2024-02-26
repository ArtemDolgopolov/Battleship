import { User } from '../types/types';
import WebSocketExt from '../types/websocketExt';

export const userDB: User[] = [];

export const wsClients = new Set<WebSocketExt>();
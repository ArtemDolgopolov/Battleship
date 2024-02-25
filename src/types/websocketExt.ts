import { WebSocket } from 'ws';

export default interface WebSocketExt extends WebSocket {
  id?: number;
  indexSocket?: number;
}
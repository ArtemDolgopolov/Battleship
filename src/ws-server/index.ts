import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { dataParser } from '../utils/dataParser';
import { WSController } from './wsController';
import WebSocketExt from '../types/websocketExt';
import { wsClients } from '../data/userData';
import { rooms } from '../data/gameData';
import { RoomsController } from '../room/rooms';
import { IncomingMessage } from 'node:http';

dotenv.config();

const WS_Port = Number(process.env.WSS_PORT) || 3000;

export const wss = new WebSocketServer({ port: WS_Port });

wss.on('connection', (ws: WebSocketExt, req: IncomingMessage) => {
  const socketData = req.socket;
  console.log(
    `Client was connected on port ${socketData.remotePort}, with address ${socketData.remoteAddress} and protocol ${socketData.remoteFamily}!`,
  );
  ws.on('error', console.error);

  ws.on('message', (data) => {
    console.log('received: %s', data);

    const result = dataParser(data.toString());

    new WSController(ws, result).checkCommand();
  });

  ws.on('close', () => {
    if (ws.indexSocket !== undefined) {
      const searchIndexRoom = rooms.findIndex((user) => {
        return user.indexSocket === ws.indexSocket;
      });
      if (searchIndexRoom !== -1) {
        rooms.splice(searchIndexRoom, 1);

        new RoomsController(ws).updateCurrentRoom();
      }
    }
    wsClients.delete(ws);
    if (ws.id !== undefined && ws.indexSocket !== undefined) {
      console.log(`User with id ${ws.id} and indexSocket ${ws.indexSocket} was disconnected!`);
    }
    console.log(
      `Client on port ${socketData.remotePort}, with address ${socketData.remoteAddress} and protocol ${socketData.remoteFamily} was disconnected!`,
    );
  });
});

wss.on('listening', () => {
  const address = wss.address();

  if (typeof address === 'object' && address !== null) {
    console.log(
      `WebSocket server is running on port ${WS_Port}, with address ${address.address} and protocol ${address.family}`,
    );
  } else {
    console.log(`WebSocket server is running on port ${WS_Port} and ${address}`);
  }
});

wss.on('error', console.error);
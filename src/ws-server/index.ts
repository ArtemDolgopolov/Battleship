import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { dataParser } from '../utils/dataParser';
import { WSController } from './wsController';

dotenv.config();

const WS_Port = Number(process.env.WSS_PORT) || 3000;

export const wss = new WebSocketServer({ port: WS_Port });

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', (data) => {
    console.log('received: %s', data);

    const result = parseData(data.toString());

    new WSController(ws, result).checkCommand();
  });
});

wss.on('listening', () => {
  console.log(`WebSocket server work on port ${WS_Port}`);
});

const broadcast = (result: any) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(result));
  });
};
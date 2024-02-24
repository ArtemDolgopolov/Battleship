import { IncomingUser } from '../types/incomingData';
import { Command } from '../types/command';

let indexSocket = 0;

export const registerUsers = (ws: WebSocketEx, data: IncomingUser) => {
  const { name, password } = data;

  const res = {
    type: Command.Reg,
    data: '',
    id: 0,
  };
  const findUser = userDB.find((elem) => elem.name === name);

  if (!name || !password || name.length < 5 || password.length < 5) {
    res.data = JSON.stringify({
      ...data,
      error: true,
      errorText: 'Error',
    });
  } else if (findUser && findUser.password !== password) {
    res.data = JSON.stringify({ name: name, index: findUser.index, error: true, errorText: 'Wrong password' });
  } else if (findUser && findUser.password === password) {
    res.data = JSON.stringify({ name: name, index: findUser.index, error: false, errorText: '' });
    ws.id = findUser.index;
    ws.indexSocket = indexSocket;
    indexSocket++;
    wsClients.add(ws);
  } else {
    const newUser = addUser(name, password);
    wsClients.add(ws);
    res.data = JSON.stringify({ name: name, index: newUser.index, error: false, errorText: '' });

    ws.id = newUser.index;
    ws.indexSocket = indexSocket;
    indexSocket++;
  }
  ws.send(JSON.stringify(res));
};
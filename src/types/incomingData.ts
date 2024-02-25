export interface IncomingData {
  type: string;
  data: IncomingUser | IncomingRoom;
  id: 0;
}

export interface IncomingUser {
  name: string;
  password: string;
}

export interface IncomingRoom {
 indexRoom: number;
}
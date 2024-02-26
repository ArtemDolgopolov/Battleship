export interface IncomingData {
 type: string;
 data: IncomingUser | IncomingRoom | UserShips | AttackUser | RandomAttack;
 id: 0;
}

export interface IncomingUser {
 name: string;
 password: string;
}

export interface IncomingRoom {
 indexRoom: number;
}

export interface UserShips {
 gameId: number;
 ships: ShipsCoord[];
 indexPlayer: number;
}

export interface ShipsCoord {
 position: {
   x: number;
   y: number;
 };
 direction: boolean;
 length: number;
 type: 'small' | 'medium' | 'large' | 'huge';
}

export interface AttackUser {
 gameId: number;
 x: number;
 y: number;
 indexPlayer: number;
}

export interface RandomAttack {
 gameId: number;
 indexPlayer: number;
}

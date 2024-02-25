export interface ResponseUser extends ResponseUserInfo {
 error: boolean;
 errorText: string;
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

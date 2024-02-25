export interface ResponseUser extends ResponseUserInfo {
 error: boolean;
 errorText: string;
}

export interface RoomGame {
 roomId: number;
 roomUsers: ResponseUserInfo[];
}

interface ResponseUserInfo {
 name: string;
 index: number;
}

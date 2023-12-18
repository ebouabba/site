import { Socket } from "socket.io-client";
export interface messageProps {
    id: number,
    content: string,
    createdAt: string,
    senderId: number
}

export interface userProps {


    flag1: boolean;    // 
    id: number,
    createdAt: string,
    updatedAt: string,
    email: string,
    hash: string,
    username: string,
    firstName: string,
    lastName: string,
    foto_user: string,
    isOnline: boolean,
    userId: number
    flag?: boolean
    room: string
    won: number,
    lost: number,
    level: number,
}


export interface AppProps {
    onlineUsersss: Array<number>,
    currentUser: userProps,
    users: Array<userProps>,
    amis: Array<userProps>,
    socket: Socket,
}
export interface AppPropsNow {
    onlineUsersss: Array<number>,
    socket: Socket,
}

export interface BoxSearchrProps {
    searchUser: string;
    setSearchUser: (searchUser: string) => void;
    onlineUsersss: Array<number>;
    id: number;
    users: Array<userProps>;
    amis: Array<userProps>;
}

export interface GameCardsProps {
    currentUser: userProps;
    socket: Socket
    setselectPlayer: (selectPlayer: string) => void

}

export const userData = { id: 0, createdAt: "", updatedAt: "", email: "", hash: "", username: "", firstName: "", lastName: "", foto_user: "", isOnline: false, userId: 0, flag: false, flag1: false, room: '', won: 0, lost: 0, level: 0 }

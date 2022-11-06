import { FriendUser } from 'src/modules/friend/friend.dto';
import { ListDTO } from 'src/utils/dto';

export class EventsLoginDTO {
  token: string;
}

export class EventsLogoutDTO {
  token: string;
}

export interface MessageModel {
  friendId: number;
  userId: number;
  status?: number;
  content: TextMessage | ImageMessage;
}

export interface RoomMessageModel {
  roomId: number;
  userId: number;
  status?: number;
  content: TextMessage | ImageMessage;
}

export interface MessageContent {
  type: string;
}

export interface TextMessage extends MessageContent {
  text: string;
}

export interface ImageMessage extends MessageContent {
  url: string;
}

export class MsgListDTO extends ListDTO {
  friendId: number;
}

export interface FriendModel {
  id: number;
  user: FriendUser;
  friend: FriendUser;
  //0:待添加，1：已添加，2：已删除
  statue: number;
  type: number;
  createdDate: Date;
  updatedDate: Date;
}

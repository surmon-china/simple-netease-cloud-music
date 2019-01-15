
declare type Id = number | string;

declare interface IClassOption {
  cookie?: string;
}

declare class NeteaseMusic {
  constructor(option?: IClassOption);
  search (keyword?: string, page?: number, limit?: number): Promise<any>;
  artist (id: Id, limit?: number): Promise<any>;
  playlist (id: Id): Promise<any>;
  _playlist (id: Id): Promise<any>;
  album (id: Id): Promise<any>;
  song (id: Id): Promise<any>;
  url (id: Id, br?: number): Promise<any>;
  lyric (id: Id): Promise<any>;
  picture (id: Id, size?: number): Promise<any>;
}

declare namespace NeteaseMusic {}

export = NeteaseMusic;

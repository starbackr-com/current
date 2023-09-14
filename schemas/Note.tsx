import Realm from 'realm';

class Note extends Realm.Object<Event> {
  content: string;
  images: string[];
  id: string;
  pubkey: string;
  createdAt: number;
  tags: [];
  kind: number;
  repliesTo?: string;
  root?: string;
  mentions?: string;
  sig: string;

  static schema = {
    name: 'Note',
    properties: {
      _id: 'objectId',
      content: 'string',
      pubkey: 'string',
      id: 'string',
      createdAt: 'int',
      tags: 'string[]',
      kind: 'int',
      repliesTo: 'string?',
      root: 'string?',
      mentions: 'string?',
      images: 'string?[]',
      sig: 'string',
    },
    primaryKey: 'id',
  };
}

export default Note;

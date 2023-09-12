import Realm from 'realm';

class Event extends Realm.Object<Event> {
  _id!: Realm.BSON.ObjectId;
  author: string;
  content: string;
  kind: number;
  tags: string[][];
  createdAt: number;

  static schema = {
    name: 'User',
    properties: {
      _id: 'objectId',
      pubkey: 'string',
      name: 'string?',
      display_name: 'string?',
      picture: 'string?',
      about: 'string?',
      updatedAt: 'int',
      lud06: 'string?',
      lud16: 'string?',
      nip05: 'string?',
      status: 'string?',
    },
    primaryKey: 'pubkey',
  };
}

export default Event;

import Realm from 'realm';

class User extends Realm.Object<User> {
  _id!: Realm.BSON.ObjectId;
  pubkey: string;
  name?: string;
  display_name?: string;
  picture?: string;
  about?: string;
  updatedAt: number;
  lud06?: string;
  lud16?: string;
  nip05?: string;
  status?: string;

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

export default User;

import { nip04 } from 'nostr-tools';

class Message {
  constructor(eventData) {
    this.eventData = eventData;
    this.id = eventData.id;
    this.content = eventData.content;
    this.created_at = eventData.created_at;
    this.kind = eventData.kind;
    this.pubkey = eventData.pubkey;
    this.sig = eventData.sig;
    this.tags = eventData.tags;
    this.receiver = eventData.tags[0][1];
  }

  async save() {
    try {
      if (this.kind === 4) {
        // do domething
      } else {
        console.log(
          `Events of kind ${this.kind} are not handled by Message Class`,
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  async decrypt(ownPk, sk) {
    const { pubkey, content, receiver, id, created_at, kind, sig, tags } = this;
    let decryptedText;
    try {
      console.log(content);
      if (pubkey === ownPk) {
        decryptedText = await nip04.decrypt(sk, receiver, content);
      }
      if (receiver === ownPk) {
        decryptedText = await nip04.decrypt(sk, pubkey, content);
      }
    } catch (err) {
      console.log(err);
    }
    return {
      id,
      content: decryptedText,
      created_at,
      kind,
      pubkey,
      sig,
      tags,
      receiver,
    };
  }
}

export default Message;

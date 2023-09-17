import { store } from '../../../store/store';
import { addCommunity } from '../communitySlice';

function getSlug(communityEvent) {
  const [communitySlugTag] = communityEvent.tags.filter(
    (tag) => tag[0] === 'd',
  );
  if (communitySlugTag) {
    return communitySlugTag[1];
  }
  return '';
}

function getPicture(communityEvent) {
  const [pictureTag] = communityEvent.tags.filter(
    (tag) => tag[0] === 'picture',
  );
  if (pictureTag) {
    return pictureTag[1];
  }
  return undefined;
}

class Community {
  constructor(communityEvent, relay) {
    this.communitySlug = getSlug(communityEvent);
    this.relay = relay;
    this.relayKey = communityEvent.pubkey;
    this.communityPicture = getPicture(communityEvent);
  }

  save() {
    const serializedObj = {
      communitySlug: this.communitySlug,
      relay: this.relay,
      relayKey: this.relayKey,
      communityPicture: this.communityPicture,
    };
    store.dispatch(
      addCommunity(serializedObj),
    );
  }
}

export default Community;

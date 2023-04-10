import { Note } from './Note';
import { getReadRelays, getRelayUrls, pool } from './relays.ts';

export const getEventById = async (eventIdInHex) => {
  const readUrls = getRelayUrls(getReadRelays());
  const receivedEvent = await new Promise((resolve, reject) => {
    const sub = pool.sub(readUrls, [{ ids: [eventIdInHex] }], {
      skipVerification: true,
    });
    sub.on('event', (event) => {
      const newEvent = new Note(event).save();
      resolve(newEvent);
    });
    setTimeout(() => {
      reject();
    }, 3200);
  });
  return receivedEvent;
};

export default getEventById;

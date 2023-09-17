import { Note } from './Note';
import { getReadRelays, getRelayUrls, pool } from './relays';

export const getEventById = async (eventIdInHex) => {
  const readUrls = getRelayUrls(getReadRelays());
  const event = await pool.get(readUrls, { ids: [eventIdInHex] }, {
    skipVerification: true,
  });
  if (!event) {
    throw new Error('Event was not found!');
  }
  const newEvent = new Note(event).save();
  return newEvent;
};

export default getEventById;

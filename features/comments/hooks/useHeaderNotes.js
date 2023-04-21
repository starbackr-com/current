import { useEffect, useState } from 'react';
import { Note } from '../../../utils/nostrV2';
import { useRelayUrls } from '../../relays';
import { pool } from '../../../utils/nostrV2/relays.ts';

export const useHeaderNotes = (parentEvent) => {
  const [root, setRootEvent] = useState();
  const [parent, setParentEvent] = useState();
  const { readUrls } = useRelayUrls();

  useEffect(() => {
    let ids;
    const parentETags = parentEvent.tags.filter((tag) => tag[0] === 'e');
    if (parentETags.length > 0) {
      ids = [parentEvent.id, parentETags[0][1]];
    } else {
      ids = [parentEvent.id];
    }
    const sub = pool.sub(readUrls, [
      {
        ids,
      },
    ]);

    sub.on('event', (event) => {
      const note = new Note(event);
      const parsedNote = note.save();
      if (parsedNote.id === parentEvent.id) {
        setParentEvent(parsedNote);
      } else if (parsedNote.id === parentETags[0][1]) {
        setRootEvent(parsedNote);
      }
    });
  }, []);

  return { parent, root };
};

export default useHeaderNotes;

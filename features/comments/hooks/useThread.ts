import { useEffect, useState } from 'react';
import { pool } from '../../../utils/nostrV2';
import { useRelayUrls } from '../../relays';
import { buildThread } from '../utils/threads';
import { Filter } from 'nostr-tools';
import Kind1Note from '../../../models/Kind1Note';

const useThread = (noteId) => {
  const [notes, setNotes] = useState([]);
  const [replies, setReplies] = useState([]);
  const [startNote, setStartNote] = useState<Kind1Note>();
  const [thread, setThread] = useState([]);
  const [showThread, setShowThread] = useState(false);
  const { readUrls } = useRelayUrls();

  useEffect(() => {
    async function getThreadNotes() {
      console.log(noteId)
      const baseNote = await pool.get(
        readUrls,
        { ids: [noteId] },
        { skipVerification: true },
      );
      if (!baseNote) {
        return;
      }
      const parsedBaseNote = new Kind1Note(baseNote)
      setStartNote(parsedBaseNote);
      let filter: Filter[];
      if (parsedBaseNote.root) {
        filter = [{ kinds: [1], '#e': [parsedBaseNote.root, noteId] }, { ids: [parsedBaseNote.root] }];
      } else {
        filter = [{ kinds: [1], '#e': [noteId] }];
      }
      const threadSub = pool.sub(readUrls, filter, {
        skipVerification: true,
      });
      const allParsedNotes = new Set();
      const replies = new Set();
      threadSub.on('event', (note) => {
        const parsedEvent = new Kind1Note(note);
        allParsedNotes.add(parsedEvent);
        if (parsedEvent.repliesTo === noteId) {
          replies.add(parsedEvent);
          setReplies([...replies]);
        }
        setNotes([...allParsedNotes]);
      });
    }
    getThreadNotes();
  }, []);

  useEffect(() => {
    if (notes.length > 1 && showThread) {
      const noteObj = {};
      notes.forEach((note) => (noteObj[note.id] = note));
      const commentThread = buildThread(startNote, noteObj, []);
      const filteredThread = commentThread.filter((note) => note.id !== noteId);
      setThread(filteredThread);
    }
  }, [notes, showThread]);

  return [thread, replies, startNote, showThread, setShowThread];
};

export default useThread;

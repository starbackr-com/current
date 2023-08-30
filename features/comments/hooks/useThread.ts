import { useEffect, useState } from 'react';
import { pool } from '../../../utils/nostrV2';
import { useRelayUrls } from '../../relays';
import { buildThread, getRoot, repliesTo } from '../utils/threads';
import { Event } from 'nostr-tools';

const useThread = (noteId) => {
  const [notes, setNotes] = useState({});
  const [replies, setReplies] = useState([]);
  const [startNote, setStartNote] = useState<Event>();
  const [thread, setThread] = useState([]);
  const { readUrls } = useRelayUrls();
  useEffect(() => {
    async function getThreadNotes() {
      const baseNote = await pool.get(
        readUrls,
        { ids: [noteId] },
        { skipVerification: true },
      );
      if (!baseNote) {
        return;
      }
      setStartNote(baseNote);
      const rootId = getRoot(baseNote);
      const start = performance.now()
      const threadNotes = await pool.list(readUrls, [
        { kinds: [1], '#e': [rootId, noteId] },
        { ids: [rootId] },
      ], {skipVerification: true, eoseSubTimeout: 1500});
      console.log(performance.now() - start);
      const noteObj = {};
      const replies = new Set();
      threadNotes.forEach((note) => {
        noteObj[note.id] = note;
        if (repliesTo(note) === noteId) {
          replies.add(note);
          setReplies([...replies]);
        }
      });
      setNotes(noteObj);
    }
    getThreadNotes();
  }, []);

  useEffect(() => {
    if (Object.keys(notes).length > 1) {
      const commentThread = buildThread(startNote, notes, []);
      const filteredThread = commentThread.filter(note => note.id !== noteId)
      setThread(filteredThread);
    }
  }, [notes]);

  return [thread, replies, startNote];
};

export default useThread;

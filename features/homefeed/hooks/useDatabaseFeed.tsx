import { useQuery, useRealm } from '@realm/react';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Realm from 'realm';
import Note from '../../../schemas/Note';
import { pool } from '../../../utils/nostrV2';
import { useRelayUrls } from '../../relays';
import { useSelector } from 'react-redux';
import Kind1Note from '../../../models/Kind1Note';
import Kind1063Media from '../../../models/Kind1063Media';

const useDatabaseFeed = (filter) => {
  let query;
  const [page, setPage] = useState<number>(1);
  const realm = useRealm();
  if (filter.text && filter.images) {
    query = `root == nil AND kind in {1, 1063} SORT(createdAt DESC)`;
  }
  if (!filter.text && filter.images) {
    query = `root == nil AND kind in {1, 1063} AND images.@count > 0 SORT(createdAt DESC)`;
  }
  if (filter.text && !filter.images) {
    query = `root == nil AND kind in {1, 1063} AND images.@count < 1 SORT(createdAt DESC)`;
  }
  const notes = useQuery<Note>(
    Note,
    (collection) => {
      return collection.filtered(query);
    },
    [page, filter],
  );

  const requestedNotes = notes.filtered(query);
  const { readUrls } = useRelayUrls();
  //@ts-ignore
  const followedPubkeys = useSelector((state) => state.user.followedPubkeys);

  const eventCallback = useCallback(
    (event) => {
      const start = performance.now();
      if (event.kind === 1) {
        console.log('new event');
        try {
          realm.write(() => {
            const newNote = new Kind1Note(event);
            realm.create('Note', {
              _id: new Realm.BSON.ObjectID(),
              content: newNote.content,
              images: newNote.images,
              id: newNote.id,
              pubkey: newNote.pubkey,
              createdAt: newNote.createdAt,
              tags: newNote.tags.map((tag) => JSON.stringify(tag)),
              kind: newNote.kind,
              repliesTo: newNote.repliesTo,
              root: newNote.root,
              mentions: newNote.mentions,
              sig: newNote.sig,
            });
          });
        } catch (e) {
          // console.log(e);
        } finally {
          // console.log(performance.now() - start);
        }
      } else if (event.kind === 1063) {
        try {
          realm.write(() => {
            const newNote = new Kind1063Media(event);
            console.log(newNote);
            if (newNote.type === 'image') {
              realm.create('Note', {
                _id: new Realm.BSON.ObjectID(),
                content: newNote.content,
                images: [newNote.media],
                id: newNote.id,
                pubkey: newNote.pubkey,
                createdAt: newNote.createdAt,
                tags: newNote.tags.map((tag) => JSON.stringify(tag)),
                kind: newNote.kind,
                repliesTo: newNote.repliesTo,
                root: newNote.root,
                mentions: newNote.mentions,
                sig: newNote.sig,
              });
            }
          });
        } catch (e) {
          console.log(e);
        } finally {
          console.log(performance.now() - start);
        }
      }
    },
    [realm],
  );

  useEffect(() => {
    console.log('base effect runs');
    let newSub;
    const latestNote = notes.filtered(
      'id != nil SORT(createdAt DESC) LIMIT(1)',
    );
    console.log(latestNote);
    if (latestNote.length > 0) {
      console.log('getting latest notes from base effect');
      newSub = pool.sub(
        readUrls,
        [
          {
            authors: followedPubkeys,
            kinds: [1, 1063],
            since: latestNote[0].createdAt,
          },
        ],
        { skipVerification: true },
      );
      newSub.on('event', eventCallback);
    }
    return () => {
      if (newSub) {
        newSub.unsub();
      }
    };
  }, [filter]);
  useEffect(() => {
    console.log('second effect runs');
    console.log(page);
    let sub;
    if (requestedNotes.length < page * 25) {
      console.log('not enought notes to satisfy page');
      const oldestNote = notes.filtered(
        'id != nil SORT(createdAt DESC) LIMIT(1)',
      );

      if (oldestNote.length < 1) {
        console.log('no latest note, getting 100 notes');

        const sub = pool.sub(
          readUrls,
          [
            {
              authors: followedPubkeys,
              kinds: [1, 1063],
              limit: 100,
            },
          ],
          { skipVerification: true },
        );
        sub.on('event', eventCallback);
      } else {
        console.log('getting 100 notes older than oldest note');

        const sub = pool.sub(
          readUrls,
          [
            {
              authors: followedPubkeys,
              kinds: [1, 1063],
              until: oldestNote[0].createdAt,
              limit: 100,
            },
          ],
          { skipVerification: true },
        );
        sub.on('event', eventCallback);
      }
    }
    return () => {
      if (sub) {
        sub.unsub();
      }
    };
  }, [page]);
  return [requestedNotes, setPage];
};

export default useDatabaseFeed;

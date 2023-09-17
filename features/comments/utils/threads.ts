import { Event } from 'nostr-tools';
import Kind1Note from '../../../models/Kind1Note';

export function repliesTo(event: Event) {
  if (event.tags.length < 1) {
    return undefined;
  }
  const eTags = event.tags.filter((tag) => tag[0] === 'e');
  if (eTags.length < 1) {
    return undefined;
  }
  const replyTag = eTags.filter((tag) => tag[3] === 'reply');
  if (replyTag.length > 1) {
    return replyTag[0][1];
  }
  if (eTags.length === 1) {
    return eTags[0][1];
  }
  return eTags[eTags.length - 1][1];
}

export function getRoot(event: Event) {
  const eTags = event.tags.filter((tag) => tag[0] === 'e');
  if (eTags.length === 0) {
    return undefined;
  }
  if (eTags.length === 1) {
    return eTags[0][1];
  }
  if (eTags.length > 1) {
    const rootTag = eTags.filter((tag) => tag[3] === 'root');
    if (rootTag.length > 0) {
      return rootTag[0][1];
    }
    return eTags[0][1];
  }
}

export function buildThread(note: Kind1Note, allnotes, thread = []) {
  const parentNoteId = note.repliesTo;
  if (!parentNoteId || !allnotes[parentNoteId]) {
    return [note, ...thread];
  }
  const parentNote = allnotes[parentNoteId];
  const newThread = [note, ...thread];
  return buildThread(parentNote, allnotes, newThread);
}

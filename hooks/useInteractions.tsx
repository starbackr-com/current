import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const useInteractions = (eventId) => {
  const { likedEvents, zappedEvents, repostedEvents } = useSelector(
    //@ts-ignore
    (state) => state.interaction,
  );
  const status = useMemo(() => {
    const isLiked: boolean = likedEvents.includes(eventId);
    const isZapped: boolean = zappedEvents.includes(eventId);
    const isReposted: boolean = repostedEvents.includes(eventId);
    return {isLiked, isZapped, isReposted}
  }, [
    eventId,
    likedEvents,
    zappedEvents,
    repostedEvents,
  ]);
  return status;
};

export default useInteractions
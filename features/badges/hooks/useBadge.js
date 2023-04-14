import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBadge } from '../utils';
import { addBadge } from '../badgeSlice';

const useBadge = (badgeEventId) => {
  const badge = useSelector((state) => state.badges.badges[badgeEventId]);
  const dispatch = useDispatch();

  async function addBadgeToStore() {
    const event = await getBadge(badgeEventId);
    dispatch(addBadge(event));
  }

  useEffect(() => {
    if (!badge) {
      addBadgeToStore();
    }
  }, []);

  return badge;
};

export default useBadge;

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBadge } from '../utils';
import { addBadge } from '../badgeSlice';

const useBadge = (badgeUID) => {
  const badge = useSelector((state) => state.badges.badges[badgeUID]);
  const dispatch = useDispatch();

  async function addBadgeToStore() {
    const event = await getBadge(badgeUID);
    dispatch(addBadge({ badgeUID, event }));
  }

  useEffect(() => {
    if (!badge) {
      addBadgeToStore();
    }
  }, []);

  return badge;
};

export default useBadge;

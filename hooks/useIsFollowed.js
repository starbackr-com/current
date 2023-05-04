import { useSelector } from 'react-redux';

const useIsFollower = (pubkey) => {
  const followedPubkeys = useSelector((state) => state.user.followedPubkeys);
  return followedPubkeys.includes(pubkey);
};

export default useIsFollower;

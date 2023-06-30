import { useSelector } from 'react-redux';

const useIsMember = (communityObject) => {
  const joinedCommunities = useSelector(
    (state) => state.community.joinedCommunities,
  );
  return joinedCommunities.includes(communityObject.communitySlug);
};

export default useIsMember;

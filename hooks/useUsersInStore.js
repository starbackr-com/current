import { matchSorter } from 'match-sorter';
import { useSelector } from 'react-redux';

const useUsersInStore = (searchTerm) => {
  if (searchTerm.length < 1) {
    return [];
  }
  const users = useSelector((state) => state.messages.users);
  const userArray = Object.keys(users).map((user) => users[user]);

  const result = matchSorter(userArray, searchTerm, {
    keys: ['name', 'pubkey', 'nip05'],
  }).slice(0, 25);
  return result;
};

export default useUsersInStore;

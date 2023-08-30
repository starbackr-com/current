import { useSelector } from "react-redux";

const useUser = (pubkeyInHex) => {
  const user = useSelector((state) => state.messages.users[pubkeyInHex]);
  return user
};

export default useUser;
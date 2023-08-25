import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pool } from "../utils/nostrV2";
import { useRelayUrls } from "../features/relays";
import { setStatus } from "../features/messagesSlice";

const useStatus = (pubkeyInHex) => {
  const [loading, setLoading] = useState(true);
  //@ts-ignore
  const userStatus = useSelector(state => state.messages.userStatus[pubkeyInHex]);
  const {readUrls} = useRelayUrls();
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    const now = Math.floor(Date.now() / 1000);
    if(!userStatus || userStatus.updatedAt < now - 3600) {
      async function getStatus() {
        const status = await pool.list(readUrls, [{authors: [pubkeyInHex], kinds: [30315], '#d': ['general']}], {skipVerification: true})
        if(status.length === 0) {
          dispatch(setStatus({pubkey: pubkeyInHex, status: {content: '', r: '', updatedAt: now}}))
        }
        if (status.length === 1) {
          const rTag = status[0].tags.filter(tag => tag[0] === 'r');
          if (rTag.length > 0) {
            dispatch(setStatus({pubkey: pubkeyInHex, status: {content: status[0].content, r: rTag[0][1], updatedAt: now}}))
          }
          dispatch(setStatus({pubkey: pubkeyInHex, status: {content: status[0].content, r: '', updatedAt: now}}))
        }
        if (status.length > 1) {
          const mostRecent = status.sort((a, b) => b.created_at - a.created_at)[0];
          const rTag = mostRecent.tags.filter(tag => tag[0] === 'r');
          if (rTag.length > 0) {
            dispatch(setStatus({pubkey: pubkeyInHex, status: {content: mostRecent.content, r: rTag[0][1], updatedAt: now}}))
          }
          dispatch(setStatus({pubkey: pubkeyInHex, status: {content: mostRecent.content, r: '', updatedAt: now}}))
        }
        setLoading(false);
      }
      getStatus();
    } else {
      setLoading(false);
    }
  }, [userStatus, pubkeyInHex])
  return [userStatus, loading];
};

export default useStatus;
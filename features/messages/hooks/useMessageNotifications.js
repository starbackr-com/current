import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getData, getLastOpenedMessages } from "../../../utils/cache/asyncStorage";
import { pool } from "../../../utils/nostrV2";
import { useRelayUrls } from "../../relays";

const useMessageNotifications = () => {
  const [unread, setUnread] = useState(0)
  const {readRelays} = useRelayUrls();
  const ownPk = useSelector(state => state.auth.pubKey)
  useEffect(() => {
    async function getUnreadMessagesCount() {
      const lastOpened = await getLastOpenedMessages();
      const sub = pool.sub(readRelays, [{kinds: [4], '#p': [ownPk], since: lastOpened}])
      sub.on('event', () => {console.log('Got a message!')})
    }
    getUnreadMessagesCount();
  }, [])
};

export default useMessageNotifications;
import { useEffect } from 'react';
import { pool } from '../../../utils/nostrV2';
import { useRelayUrls } from '../../relays';
import { Kind1063Media } from '../../../models/Kind1063Media';

const useNip94 = () => {
  const { readUrls } = useRelayUrls();
  useEffect(() => {
    const sub = pool.sub(readUrls, [{kinds: [1063], limit: 1}], {skipVerification: true});
    sub.on('event', (event) => {
      const parsedEvent = new Kind1063Media(event);
      console.log(parsedEvent);
    })
  }, []);
};

export default useNip94;

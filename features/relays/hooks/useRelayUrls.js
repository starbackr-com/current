import { useSelector } from 'react-redux';

function useRelayUrls() {
  const relays = useSelector((state) => state.relays.relays);
  const readUrls = relays
    .filter((relay) => relay.read)
    .map((relay) => relay.url);
  const writeUrls = relays
    .filter((relay) => relay.read)
    .map((relay) => relay.url);

  return { readUrls, writeUrls };
}

export default useRelayUrls;

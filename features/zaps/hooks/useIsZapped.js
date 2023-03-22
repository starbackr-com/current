import { useSelector } from "react-redux";

export const useIsZapped = (eventId) => {
    const zappedEvents = useSelector(state => state.interaction.zappedEvents)
    return zappedEvents.includes(eventId);
};
import { useSelector } from "react-redux";

export const useIsAuthed = (pubkey) => {
    const loggedInKey = useSelector(state => state.auth.pubKey)
    return (pubkey === loggedInKey)
}
;
import { store } from "../../store/store";
import { addUser } from "../../features/messagesSlice";

export class Event {
    constructor(eventData) {
        this.eventData = eventData;
        this.content = eventData.content;
        this.created_at = eventData.created_at;
        this.kind = eventData.kind;
        this.pubkey = eventData.pubkey;
        this.sig = eventData.sig;
        this.tags = eventData.tags;
    }

    async save() {
        try {
            if (this.kind === 0) {
                this.saveUserData();
            } else if (this.kind === 1) {
                this.saveNote();
            } else {
                console.log(`Events of kind ${this.kind} are not handled`);
            }
        } catch (err) {
            console.log(err);
        }
    }

    saveUserData() {
        const { id, pubkey, created_at, content } = this;
        const userData = JSON.parse(content);
        try {
            const user = {
                id,
                pubkey,
                name: userData.name,
                picture: userData.picture,
                about: userData.about,
                display_name: userData.display_name,
                created_at,
            };
        store.dispatch(addUser({user}))
            
        } catch (err) {
            console.log(err);
        }
    }

    saveNote() {
        const { id, pubkey, created_at, kind, tags, content, sig } = this;
        const sql = `INSERT INTO arc_notes (id, pubkey, created_at, kind, tags, content, sig) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [
            id,
            pubkey,
            created_at,
            kind,
            JSON.stringify(tags),
            content,
            sig,
        ];

        try {
            const note = {
                id,
                pubkey,
                created_at,
                kind,
                tags: JSON.stringify(tags),
                content,
                sig,
            };

            addNoteHelper(note);
        } catch (err) {
            console.log(err);
        }
    }
}

import { addMessage, addUser } from "../../features/messagesSlice";

import { db } from "../database";

let store;

export const injectStore = (_store) => {
    store = _store;
};

const parseContent = (message) => {
    let imageRegex = /(http(s?):)([\/|.|\w|\s|\-|_])*\.(?:jpg|gif|png|jpeg)/g;
    let imageURL = message.match(imageRegex);
    let invoiceRegex = /(lnbc\d+[munp][A-Za-z0-9]+)/g;
    let invoice = message.match(invoiceRegex);
    let newMessage = message
        .replace(imageRegex, function (url) {
            return "";
        })
        .replace(invoiceRegex, function (url) {
            return "";
        });
    return { imageURL, newMessage, invoice };
};

const parseMentions = (event) => {
    if (event.tags.length < 1) {
        return {};
    }
    let content = event.content;
    let matches = content.match(/#\[([0-9]+)]/g);
    if (!matches) {
        return {};
    }
    let mentions = matches.map((match, i) => {
        return { index: i, type: event.tags[i][0], mention: event.tags[i][1] };
    });
    return { mentions };
};

export class Event {
    constructor(eventData) {
        this.eventData = eventData;
        this.id = eventData.id;
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
        const sql = `INSERT OR REPLACE INTO users (id, pubkey, name, display_name, picture, about, created_at, lud06, lud16, nip05) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [
            id,
            pubkey,
            userData.name,
            userData.display_name,
            userData.picture,
            userData.about,
            created_at,
            userData.lud06,
            userData.lud16,
            userData.nip05,
        ];
        try {
            const user = {
                id,
                pubkey,
                name: userData.name,
                picture: userData.picture,
                about: userData.about,
                display_name: userData.display_name,
                lud06: userData.lud06,
                created_at,
                lud16: userData.lud16,
                nip05: userData.nip05,
            };
            store.dispatch(addUser({ user }));
        } catch (err) {
            console.log(err);
        }

        try {
            db.transaction((tx) => {
                tx.executeSql(
                    sql,
                    params,
                    (_, result) => {},
                    (_, error) => {
                        console.error("Save user error", error);
                        return false;
                    }
                );
            });
        } catch (e) {
            console.error(e);
            console.error(e.stack);
        }
    }

    saveNote() {
        const { id, pubkey, created_at, kind, tags, content, sig } = this;
        const { imageURL, newMessage, invoice } = parseContent(content);
        const { mentions } = parseMentions(this);
        let root = !tags.some((tag) => {
            let response = tag.includes("e");
            return response;
        });
        try {
            const note = {
                id,
                pubkey,
                created_at,
                kind,
                tags,
                content: newMessage,
                sig,
                root,
                image: imageURL ? imageURL[0] : undefined,
                invoice,
                mentions,
            };
            store.dispatch(addMessage({ event: note }));
        } catch (err) {
            console.log(err);
        }
    }
}

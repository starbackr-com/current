import { store } from "../../store/store";
import { addMessage, addUser } from "../../features/messagesSlice";

import * as SQLite from "expo-sqlite";

import { db } from "../database";

const parseContent = (message) => {
    let imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
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
        const sql = `INSERT OR REPLACE INTO users (id, pubkey, name, display_name, picture, about, created_at, lud06) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [
            id,
            pubkey,
            userData.name,
            userData.display_name,
            userData.picture,
            userData.about,
            created_at,
            userData.lud06
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
                    (_, result) => {
                        console.log(result)
                    },
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
                tags: JSON.stringify(tags),
                content: newMessage,
                sig,
                root,
                image: imageURL ? imageURL[0] : undefined,
                invoice
            };
            store.dispatch(addMessage({ event: note }));
        } catch (err) {
            console.log(err);
        }
    }
}

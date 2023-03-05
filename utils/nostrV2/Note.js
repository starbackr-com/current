import { imageRegex } from "../../constants/regex";

const parseContent = (message) => {
    let imageURL = message.match(imageRegex);
    let newMessage = message.replace(imageRegex, "").trim();
    return { imageURL, newMessage };
};

const parseMentions = ({ content, tags }) => {
    if (tags.length < 1) {
        return {};
    }
    const matches = content.match(/#\[([0-9]+)]/g) || [];
    const mentions = matches
        .map((match, i) => ({ index: i, type: tags[i][0], mention: tags[i][1] }));
    return { mentions };
};

export class Note {
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
    checkRoot() {
        return !this.tags.some((tag) => tag.includes("e"));
    }
    save() {
        const { id, pubkey, created_at, kind, tags, content, sig, relay } =
            this;
        const { imageURL, newMessage } = parseContent(content);
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
                image: imageURL ? imageURL : undefined,
                mentions,
                type: imageURL ? "image" : "text",
            };
            return note;
        } catch (err) {
            console.log(err);
        }
    }
}

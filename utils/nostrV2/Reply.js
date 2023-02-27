const checkReply = (tags) => {
    const eTags = tags.filter((tag) => tag[0] === "e");
    if (eTags.length === 1) {
        console.log(eTags[0][1])
        return eTags[0][1];
    } else {
        const repliesTo = eTags[eTags.length - 1];
        return repliesTo[1];
    }
};

const checkRoot = (eTags) => {
    const root = eTags.filter((tag) => tag[3] === "root");
    return root[1];
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
        }).trim();
    return { imageURL, newMessage, invoice };
};

const parseMentions = (tags, content) => {
    if (tags.length < 1) {
        return {};
    }
    let matches = content.match(/#\[([0-9]+)]/g);
    if (!matches) {
        return {};
    }
    let mentions = matches.map((match, i) => {
        return { index: i, type: tags[i][0], mention: tags[i][1] };
    });
    console.log(mentions)
    return mentions;
};

export class Reply {
    constructor(eventData) {
        this.eventData = eventData;
        this.id = eventData.id;
        this.created_at = eventData.created_at;
        this.kind = eventData.kind;
        this.pubkey = eventData.pubkey;
        this.sig = eventData.sig;
        this.tags = eventData.tags;
        this.eTags = eventData.tags.filter((tag) => tag[0] === "e");
        this.repliesTo = checkReply(eventData.tags);
        this.root = checkRoot(this.eTags);
        const { imageURL, newMessage, invoice } = parseContent(eventData.content);
        this.content = newMessage
        this.invoice = invoice,
        this.images = imageURL ? imageURL : undefined,
        this.type = imageURL ? 'image' : 'text',
        this.mentions = parseMentions(this.tags, this.content)
    }
}

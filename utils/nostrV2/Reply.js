const checkReply = (tags) => {
    const eTags = tags.filter(tag => tag[0] === 'e')
    if (eTags.length < 2) {
        return undefined
    }
    const repliesTo = eTags[eTags.length - 1]
    return repliesTo[1]
};

const checkRoot = (eTags) => {
    const root = eTags.filter(tag => tag[3] === 'root')
    return root[1]
};

export class Reply {
    constructor(eventData) {
        this.eventData = eventData;
        this.id = eventData.id;
        this.content = eventData.content;
        this.created_at = eventData.created_at;
        this.kind = eventData.kind;
        this.pubkey = eventData.pubkey;
        this.sig = eventData.sig;
        this.tags = eventData.tags;
        this.eTags = eventData.tags.filter(tag => tag[0] === 'e')
        this.repliesTo = checkReply(eventData.tags)
        this.root = checkRoot(this.eTags)
    }};

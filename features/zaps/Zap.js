import { decode } from "light-bolt11-decoder";

export class Zap {
    constructor(eventData) {
        this.id = eventData.id;
        this.content = eventData.content;
        this.created_at = eventData.created_at;
        this.kind = eventData.kind;
        this.pubkey = eventData.pubkey;
        this.sig = eventData.sig;
        this.tags = eventData.tags;
        this.receiver = this.tags.filter((tag) => tag[0] === "p");
        this.invoice = this.tags.filter((tag) => tag[0] === "bolt11")[0][1];
        this.request = JSON.parse(
            this.tags.filter((tag) => tag[0] === "description")[0][1]
        );
        this.payer = this.request.pubkey;
        this.amount = decode(this.invoice).sections[2].value / 1000;
    }
}

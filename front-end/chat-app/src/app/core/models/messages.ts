
export interface IChatMessage {
    id?: string;
    message?: string;
    time?: any;
    user?: boolean;
    senderId?: string;
    receiverId?: string;
    messageStatus?: string;
    group?: boolean;
    senderName?: string;
}

export class ChatMessage implements IChatMessage {
    $key?: string;
    message?: string;
    time?: Date;
    user?: boolean;
    messageStatus?: string;
    senderId?: string;
    receiverId?: string;
    group?: boolean;
    senderName?: string;
    constructor(data: IChatMessage, id?: any) {
        this.$key = data.id ? data.id : id;
        this.message = data.message;
        this.time = data.time.toDate();
        this.user = data.user;
        this.messageStatus = data.messageStatus;
        this.senderId = data.senderId;
        this.receiverId = data.receiverId;
        this.group = data.group;
        this.senderName = data.senderName;
    }
}

export enum messageEnum {
    sent = 'SENT',
    delivered = 'DELIVERED',
    received = 'RECEIVED',
    seen = 'SEEN'
}

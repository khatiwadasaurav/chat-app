export interface IGroupChatMessage {
    id?: string;
    lastMessage?: string;
    lastMessageTime?: any;
    name?: string;
    receiver?: any;
    sender?: string;
    profileImageUrl?: string;
    group?: boolean;
}
export class GroupChatMessage {
    id?: string;
    lastMessage?: string;
    lastMessageTime?: Date;
    name?: string;
    receiver?: any;
    sender?: string;
    group?: boolean;
    profileImageUrl?: string;
    constructor(data: IGroupChatMessage, id?: any) {
        this.id = id;
        this.lastMessage = data.lastMessage;
        this.lastMessageTime = data.lastMessageTime.toDate();
        this.name = data.name;
        this.receiver = data.receiver;
        this.sender = data.sender;
        this.group = data.group;
        this.profileImageUrl = data.profileImageUrl;
    }
}

export interface IReceiverObject {
    id?: string;
    name?: string;
}
export class ReceiverObject {
    id?: string;
    name?: string;
    constructor(data: IReceiverObject) {
        this.id = data.id;
        this.name = data.name;
    }
}
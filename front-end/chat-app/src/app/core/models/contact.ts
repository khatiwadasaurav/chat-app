export interface IContact {
    lastMessage?: string;
    lastMessageTime?: any;
    name?: string;
    phoneNumber?: string;
    userId?: string;
    profileImageUrl?: string;
    lastMessageStatus?: string;
    group?: boolean;
    receiver?: any;
}
export class Contact implements IContact {
    id?: string;
    lastMessage?: string;
    lastMessageTime?: Date;
    lastMessageStatus?: string;
    name?: string;
    phoneNumber?: string;
    userId?: string;
    profileImageUrl?: string;
    group?: boolean;
    receiver?: any;
    constructor(data: IContact, id) {
        this.id = id;
        this.lastMessage = data.lastMessage;
        this.lastMessageTime = data.lastMessageTime ? data.lastMessageTime.toDate() : new Date();
        this.name = data.name;
        this.phoneNumber = data.phoneNumber;
        this.userId = data.userId;
        this.profileImageUrl = data.profileImageUrl;
        this.lastMessageStatus = data.lastMessageStatus;
        this.group = data.group;
        this.receiver = data.receiver;
    }
}
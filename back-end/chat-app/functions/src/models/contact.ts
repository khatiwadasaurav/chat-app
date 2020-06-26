export interface IContact {
    lastMessage?: string;
    lastMessageTime?: any;
    name?: string;
    phoneNumber?: string;
    userId?: string;
    profileImageUrl?: string;
}
export class Contact implements IContact {
    id?: string;
    lastMessage?: string;
    lastMessageTime?: Date;
    name?: string;
    phoneNumber?: string;
    userId?: string;
    profileImageUrl?: string;
    constructor(data: IContact, id: string) {
        this.id = id;
        this.lastMessage = data.lastMessage;
        this.lastMessageTime = data.lastMessageTime.toDate();
        this.name = data.name;
        this.phoneNumber = data.phoneNumber;
        this.userId = data.userId;
        this.profileImageUrl = data.profileImageUrl
    }
}
export interface IClientContact {
    email?: string;
    name?: string;
    phoneNumber?: string;
    uid?: string;
    profileImageUrl?: string;
}
export class ClientContact {
    id?: string;
    email?: string;
    name?: string;
    phoneNumber?: string;
    uid?: string;
    profileImageUrl?: string;

    constructor(data: IClientContact, id: string) {
        this.id = id;
        this.email = data.email;
        this.name = data.name;
        this.phoneNumber = data.phoneNumber;
        this.uid = data.uid;
        this.profileImageUrl = data.profileImageUrl;
    }
}
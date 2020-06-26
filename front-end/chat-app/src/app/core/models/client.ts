export interface IClient {
    email?: string;
    name?: string;
    phoneNumber?: string;
    uid?: string;
    profileImageUrl?: string;
}
export class Client {
    id?: string;
    email?: string;
    name?: string;
    phoneNumber?: string;
    uid?: string;
    profileImageUrl?: string;

    constructor(data: IClient, id) {
        this.id = id;
        this.email = data.email;
        this.name = data.name;
        this.phoneNumber = data.phoneNumber;
        this.uid = data.uid;
        this.profileImageUrl = data.profileImageUrl;
    }
}
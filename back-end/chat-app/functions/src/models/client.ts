export interface IClient {
    agree?: boolean;
    email?: string;
    fullname?: string;
    password?: string;
    photoURL?: string;
    phoneNumber?: string;
}
export class Client {
    $key?: string;
    agree?: boolean;
    email?: string;
    fullname?: string;
    photoURL?: string;
    phoneNumber?: string;

    constructor($key: string, data: IClient) {
        this.$key = $key;
        this.agree = data.agree;
        this.email = data.email;
        this.fullname = data.fullname;
        this.photoURL = data.photoURL;
        this.phoneNumber = data.phoneNumber;
    }
}
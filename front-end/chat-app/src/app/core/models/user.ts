export class User {
    id?: string;
    emailAddress?: string;
    Role?: string;
    client?: string;
    constructor(data: User, id) {
        this.id = id;
        this.emailAddress = data.emailAddress;
        this.Role = data.Role;
        this.client = data.client
    }
}
export interface IChatMessage {
    id?: string;
    message?: string;
    time?: any;
    user?: boolean;
    senderId?: string;
    receiverId?: string;
    messageStatus?: string;
    messageKey?: string;
}
export enum messageEnum {
    sent = 'SENT',
    delivered = 'DELIVERED',
    received = 'RECEIVED',
    seen = 'SEEN'
}
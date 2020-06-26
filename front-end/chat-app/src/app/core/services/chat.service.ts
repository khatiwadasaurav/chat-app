import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Observable } from 'rxjs/internal/Observable';
import { ChatMessage, IChatMessage, messageEnum } from '../models/messages';
import { GlobalVaribale } from "./global.service";
import { GroupChatMessage } from '../models/groupChat';

@Injectable()
export class ChatService {
    constructor(
        private _db: AngularFirestore,
    ) { }

    addMessage(messageData: IChatMessage, contactId: string, callback: () => void) {
        let clientId = localStorage.getItem(GlobalVaribale.clientId);
        let contactRef = this._db
            .collection(GlobalVaribale.clientRef)
            .doc(clientId)
            .collection(GlobalVaribale.contactRef)
            .doc(contactId);

        contactRef
            .set({
                'lastMessage': messageData.message,
                'lastMessageTime': messageData.time,
                'lastMessageStatus': messageData.messageStatus
            }, { merge: true }).then(after => {
                contactRef.collection(GlobalVaribale.messageRef)
                    .add(messageData)
                    .then(v => {
                        let docId: string = v.id;
                        contactRef.collection(GlobalVaribale.messageRef).doc(docId).update({ 'messageKey': docId })
                        callback();
                    });
            }).catch(error => {
                throw new Error(`Error while adding to contacts ${error}`);
            })

    }
    addGroupMessage(messageData: IChatMessage, groupId: string, callback: () => void) {
        let groupRef = this._db.collection(GlobalVaribale.groupChatMessageRef).doc(groupId);
        groupRef.set({
            'lastMessage': messageData.message,
            'lastMessageTime': messageData.time,
        }, { merge: true }).then(after => {
            groupRef.collection(GlobalVaribale.messageRef)
                .add(messageData).then(v => {
                    let docId: string = v.id;
                    groupRef.collection(GlobalVaribale.messageRef).doc(docId).update({ 'messageKey': docId })
                    callback();
                });
        }).catch(err => {
            throw new Error(`Error while updating the group ${err}`);
        })
    }

    getLatestMessage(callback: (data) => void) {
        let clientId = localStorage.getItem(GlobalVaribale.clientId);
        this._db
            .collection(GlobalVaribale.clientRef)
            .doc(clientId)
            .ref.onSnapshot(v => {
                callback(v.data());
            });
    }

    getMessages(contactKey: string): Observable<ChatMessage[]> {
        let clientId = localStorage.getItem(GlobalVaribale.clientId);
        return this._db
            .collection(GlobalVaribale.clientRef)
            .doc(clientId)
            .collection(GlobalVaribale.contactRef)
            .doc(contactKey)
            .collection(GlobalVaribale.messageRef)
            .snapshotChanges()
            .pipe(
                map(actions =>
                    actions.map(a => {
                        const data = new ChatMessage(a.payload.doc.data(), a.payload.doc.id)
                        return data;
                    })
                )
            );
    }
    getGroupChatMessage(groupChatId): Observable<ChatMessage[]> {
        return this._db.collection(GlobalVaribale.groupChatMessageRef)
            .doc(groupChatId)
            .collection(GlobalVaribale.messageRef)
            .snapshotChanges()
            .pipe(map(actions => actions.map(messages => {
                const data = new ChatMessage(messages.payload.doc.data(), messages.payload.doc.id);
                return data;
            })))

    }

}

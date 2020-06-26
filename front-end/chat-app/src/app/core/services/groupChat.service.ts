import { Injectable } from '@angular/core';
import { GlobalVaribale } from './global.service';
import { AngularFirestore } from "@angular/fire/firestore";
import { IGroupChatMessage, GroupChatMessage } from '../models/groupChat';
import { Observable } from 'rxjs';

@Injectable()
export class GroupChatService {
    constructor(
        private _db: AngularFirestore,
    ) { }

    getRelatedGroupsOfContact(selfContactId): Observable<any> {

        return this._db.collection(GlobalVaribale.groupChatMessageRef, ref => ref.where("receiver", "array-contains", selfContactId)).snapshotChanges();

    }
    createNewGroupChat(data: IGroupChatMessage) {
        return this._db.collection(GlobalVaribale.groupChatMessageRef).add(data);
    }
    updateGroupChatSetting(id: string, data: IGroupChatMessage) {
        return this._db.collection(GlobalVaribale.groupChatMessageRef).doc(id).update({ ...data });
    }
    leaveGroup(contact, groupId) {
        return this._db.collection("groupChats").doc(groupId).update(contact);
    }
}
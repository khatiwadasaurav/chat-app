import { Injectable } from '@angular/core';
import { GlobalVaribale } from './global.service';
import { Contact } from '../models/contact';
import { Http } from '@angular/http';
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { messageEnum } from '../models/messages';

@Injectable()
export class ContactService {

    constructor(
        private _db: AngularFirestore,
        private http: Http,
    ) { }

    getContacts(): Observable<Contact[]> {
        const clientId = localStorage.getItem(GlobalVaribale.clientId);
        return this._db
            .collection(GlobalVaribale.clientRef)
            .doc(clientId)
            .collection(GlobalVaribale.contactRef)
            .snapshotChanges().pipe(map(clients => {
                const clientDetails = clients.map(data => new Contact(data.payload.doc.data(), data.payload.doc.id));
                return clientDetails
            }))
    }
    updateLastMessageStatus(contactId) {
        let clientId = localStorage.getItem(GlobalVaribale.clientId);
        return this._db
            .collection(GlobalVaribale.clientRef)
            .doc(clientId)
            .collection(GlobalVaribale.contactRef)
            .doc(contactId)
            .update({ lastMessageStatus: messageEnum.seen });
    }
    getContactDetails(contactId): Observable<Contact> {
        return this._db.collection(GlobalVaribale.clientRef).doc(contactId).snapshotChanges().pipe(map(data => {
            const clientDetails = new Contact(data.payload.data(), data.payload.id);
            return clientDetails;
        }))
    }
    updateContactDetails(contactId, updatedValues) {
        console.log(contactId)
        console.log(updatedValues)
        let updateObservable;
        return updateObservable = new Observable<any>(subscriber => {
            this._db.collection(GlobalVaribale.clientRef).doc(contactId).update(updatedValues).then(success => {
                subscriber.next(success);
            })
        })

    }
}
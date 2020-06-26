import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { GlobalVaribale } from './global.service';
import { Client } from '../models/client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ClientService {
    constructor(
        private _db: AngularFirestore,
    ) { }


    getAllClients(): Observable<Client[]> {
        return this._db.collection(GlobalVaribale.clientRef).snapshotChanges().pipe(map(clients => {
            const clientData = clients.map(clientData => new Client(clientData.payload.doc.data(), clientData.payload.doc.id));
            return clientData;
        }))
    }
}
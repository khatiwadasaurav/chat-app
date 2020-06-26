import { Injectable } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabase } from "@angular/fire/database";

import * as firebase from "firebase/app";
import "firebase/firestore"; // for cloud firestore
import { Upload } from '../models/upload';

@Injectable()
export class UploadService {
    private basePathVehicle: string = "/vehicles";
    constructor(private af: AngularFireModule, private db: AngularFireDatabase) { }

    pushUploadToVehicles(
        upload: Upload,
        basePath: string,
        progressBar: (progress: number) => void,
        callback: (finalupload: Upload) => void,

    ) {
        let storageRef = firebase.storage().ref();
        if (upload.name == null) {
            upload.name =
                Math.random()
                    .toString(36)
                    .substr(2, 9) + upload.file.name;
        }
        let uploadTask = storageRef
            .child(`${basePath}/${upload.name}`)
            .put(upload.file);
        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            snapshot => {
                let progressBarData = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar(progressBarData);
            },

            error => { },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then(uploadUrl => {
                    upload.url = uploadUrl;
                    callback(upload);
                });
            }
        );
    }

    deleteUploaTrainer(upload: Upload) {
        return this.deleteFileDataVehicle(upload.$key)
            .then(() => {
                this.deleteFileStorageVehicle(upload.name);
            })
            .catch(error => console.log(error));
    }

    private deleteFileDataVehicle(key: string) {
        return this.db.list(`${this.basePathVehicle}/`).remove(key);
    }

    private deleteFileStorageVehicle(name: string) {
        let storageRef = firebase.storage().ref();
        return storageRef.child(`${this.basePathVehicle}/${name}`).delete();
    }
    uploadDocuments(
        upload: Upload,
        basePath: string,
        progressBar: (progress: number) => void,
        callback: (finalupload: Upload) => void
    ) {
        let storageRef = firebase.storage().ref();
        console.log(storageRef);
        if (upload.name == null) {
            upload.name =
                Math.random()
                    .toString(36)
                    .substr(2, 9) + upload.file.name;
        }
        console.log('File Stored in:', basePath);
        let uploadTask = storageRef
            .child(`${basePath}/${upload.name}`)
            .put(upload.file);
        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            snapshot => {
                let progressBarData = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar(progressBarData);
            },
            error => {
                console.log(error);
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then(uploadUrl => {
                    console.log('File available at', uploadUrl);
                    upload.url = uploadUrl;
                    debugger;
                    callback(upload);
                });
            }
        );
    }
}

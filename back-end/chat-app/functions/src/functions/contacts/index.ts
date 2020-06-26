import * as functions from "firebase-functions";
import { IContact, Contact } from "../../models/contact";
import { contactService } from "../../services/contact";
import { associationService } from "../../services/associations";
import { db } from "../../constant";


export const contactsListener = functions.firestore.document('clients/{clients}/contacts/{contacts}').onCreate(
    async (change, contex) => {
        const contactData = change.data() as IContact;
        const contactId = contex.params.contacts;
        const clientId = contex.params.clients;
        let dbContactInfo: Contact = await contactService.getContactInfo(contactId) as Contact;
        let associationInfo = await associationService.getContactsAssociations(clientId);
        console.log("data base contact info");
        console.log(dbContactInfo);
        console.log("now contact data");
        console.log(contactData);
        db.collection('clients')
            .doc(clientId)
            .collection('contacts')
            .doc(contactId)
            .update({ ...dbContactInfo, ...contactData }).then(success => {
                console.log('updateSuccessful');
                //now creating relation between client as contacts for easier to update of the details ;
                if (associationInfo.contacts) {
                    associationService.updateAssociation(clientId, contactId).then(associationSuccess => {
                        console.log("assoication updated successfully");
                        return associationSuccess
                    }).catch(associationErr => {
                        console.log("association error occured");
                        return associationErr;
                    })
                } else {
                    associationService.createAssociation(clientId, contactId).then(associationCreated => {
                        console.log("association created successfully");
                        return associationCreated;
                    }).catch(associationCreatedErr => {
                        console.log("error while creating association");
                        return associationCreatedErr;
                    })
                }
                return success;
            }).catch(err => {
                console.log('error');
                return err;
            })


    })



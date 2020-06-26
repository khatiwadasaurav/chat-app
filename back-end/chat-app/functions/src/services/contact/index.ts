import { db } from "../../constant";
import { Contact } from "../../models/contact";
import { ClientContact } from "../../models/clientContact";

async function addDataToContacts(data: any, clientId: any, contactId: any) {
    const addToClients = db.collection('clients').doc(clientId).collection('contacts').doc(contactId).set(data);
    return addToClients
}

async function getContactInfo(contactId: string) {
    const contactInfo = db.collection('clients').doc(contactId).get().then(v => {
        let contactDetails = { ...v.data() }
        return contactDetails

    })
    return contactInfo;
}

async function getAllContacts() {
    const contacts = db.collection('clients').get().then(clients => {
        const clientInfo = clients.docs.map(v => new Contact(v.data(), v.id));
        return clientInfo
    })
    return contacts;
}

async function getAllAssociatedContacts(clientId: string) {
    let associatedContacts: any;
    let returnData;
    //@ts-ignore
    const allClients: ClientContact[] = db.collection('clients').get().then(data => {
        return data.docs.map(v => new ClientContact(v.data(), v.id));
    })
    allClients.forEach(async (client: ClientContact, index: number) => {
        returnData = await Promise.all(await db
            .collection('clients')
            .doc(String(client.id))
            .collection('contacts')
            .where('phoneNumber', '==', clientId).get().then(allContacts => {
                let contact = allContacts.docs.map(v => new Contact(v.data(), v.id));
                associatedContacts.push(contact);
            }).catch(err => {
                console.log(err);
                return err;
            })).then(v => {
                return associatedContacts;
            })
    })
    return returnData;


}

export const contactService = {
    'addDataToContacts': addDataToContacts,
    'getContactInfo': getContactInfo,
    'getAllContacts': getAllContacts,
    'getAllAssociatedContacts': getAllAssociatedContacts
}

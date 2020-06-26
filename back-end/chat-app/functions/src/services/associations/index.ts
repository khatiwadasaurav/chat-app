import { db } from "../../constant";

async function getContactsAssociations(clientId: string) {
    const associationInfo = db.collection("associations").doc(clientId).get().then(data => {
        let associationData = { ...data.data() }
        return associationData
    })
    return associationInfo;
}
async function createAssociation(clientId: string, contactId: string) {
    const associationData = db.collection("associations").doc(clientId).set({ 'contacts': [contactId] }).then(success => {
        console.log("success");
        return success;
    })
    return associationData;
}
async function updateAssociation(clientId: string, contactId: string) {
    let contactData = await getContactsAssociations(clientId);
    let newContactArray = contactData['contacts'];
    newContactArray.push(contactId);
    const associationData = db.collection("associations").doc(clientId).update({ 'contacts': newContactArray }).then(updateSuccess => {
        console.log("association update success");
        return updateSuccess;
    })
    return associationData;
}
export const associationService = {
    'getContactsAssociations': getContactsAssociations,
    'createAssociation': createAssociation,
    'updateAssociation': updateAssociation
}
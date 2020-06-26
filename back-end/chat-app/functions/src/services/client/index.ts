import { db } from "../../constant";

export async function addDataToClients(data: any, phoneNumber: any) {
    const addToClients = db.collection('clients').doc(phoneNumber).set(data);
    return addToClients
}
export async function getClientsById(clientId: string) {
    const clientDetails = db.collection("clients").doc(clientId).get().then(client => {
        let clientData = { ...client.data() }
        return clientData;
    })
    return clientDetails;
}

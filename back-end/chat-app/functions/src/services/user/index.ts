import { db } from "../../constant";

export async function addDataToUser(userId: any, data: any) {
    const addToUser = db.collection('users').doc(userId).set(data);
    return addToUser
}
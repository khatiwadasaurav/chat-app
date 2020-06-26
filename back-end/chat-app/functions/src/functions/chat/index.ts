import * as functions from "firebase-functions";
import { IChatMessage, messageEnum } from "../../models/message";
import { db } from "../../constant";

export const messageListener = functions.firestore.document('clients/{clients}/contacts/{contacts}/messages/{messages}').onCreate(
    (change, contex) => {

        const messageData = change.data() as IChatMessage;
        const clientContext = contex.params.clients;
        const messageContext = contex.params.messages;
        const messageStatus = {
            messageStatus: messageEnum.received
        }

        const contactsRef = db.collection('clients').doc(String(messageData.receiverId)).collection('contacts').doc(String(messageData.senderId));
        console.log(messageData.messageStatus);
        console.log(clientContext);
        console.log(messageData.receiverId);
        if (messageData.messageStatus === messageEnum.sent) {
            if (clientContext === messageData.senderId) {
                console.log("it enters here");
                console.log(messageContext)
                contactsRef
                    .set({ lastMessage: messageData.message, lastMessageTime: messageData.time, lastMessageStatus: messageEnum.received }, { merge: true }).then(v => {
                        contactsRef
                            .collection('messages')
                            .doc(messageContext)
                            .set({ ...messageData, ...messageStatus }).then(data => {
                                db.collection('clients')
                                    .doc(String(messageData.senderId))
                                    .collection('contacts')
                                    .doc(String(messageData.receiverId))
                                    .collection('messages')
                                    .doc(messageContext)
                                    .update({ messageStatus: messageEnum.delivered }).then(update => {
                                        return update
                                    }).catch(error => {
                                        console.log(error);
                                        return error;
                                    })
                            }).catch(err => {
                                console.log(err);
                                return err
                            })
                    }).catch(contactUpdateErr => {
                        console.log(contactUpdateErr);
                        return contactUpdateErr;
                    })

            }
        }
        return true;
    })
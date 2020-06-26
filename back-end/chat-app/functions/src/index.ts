import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
import * as cors from 'cors';
import { corsOptions } from './constant';
import * as Client from './functions/client/index';
import * as Chat from './functions/chat/index'
import * as Contact from './functions/contacts'

cors(corsOptions);

export const clientSignup = Client.signUplistener;
export const checkEmail = Client.emailValid;
export const checkPhone = Client.phoneNumberValid;
export const deleteUserListener = Client.deleteUserListener;
export const chatMessageListener = Chat.messageListener;
export const contactCreateListener = Contact.contactsListener;
export const updateClientDetailListner = Client.updateClientsDetailsListener;
// export const emailVerificationOn = Client.emailVerification;


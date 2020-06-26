import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
import { corsOptions, db } from "../../constant";
import { IClient } from "../../models/client";
import { addDataToClients } from "../../services/client";
import { addDataToUser } from "../../services/user";
import { Contact } from "../../models/contact";
import { associationService } from "../../services/associations/index"
const corsHandler = cors(corsOptions);

export const signUplistener = functions.https.onRequest(async (req, res) => {
    return handleSignup(req, res);
});

function handleSignup(req: any, res: any) {
    const handleError = (error: Error) => {
        return res.status(500).send(error);
    };

    const handleResponse = (status: any, body?: any) => {
        if (body) {
            return res.status(status).send(body);
        }
        return res.sendStatus(status);
    };
    try {
        corsHandler(req, res, () => {
            if (req.method !== "POST") {
                return handleResponse(403);
            }
            const reqBody = req.body;
            console.log(reqBody);
            const clientData: IClient = {
                agree: reqBody.agree,
                email: reqBody.email,
                password: reqBody.password,
                fullname: reqBody.fullname,
                photoURL: reqBody.photoURL,
                phoneNumber: reqBody.phoneNumber
            };
            const createUser = admin
                .auth()
                .createUser({
                    email: clientData.email,
                    password: clientData.password,
                    displayName: clientData.fullname,
                    disabled: false,
                    photoURL: clientData.photoURL,
                    phoneNumber: clientData.phoneNumber
                })
                .then(userRecord => {
                    console.log('49');
                    const addtoClients = addDataToClients(
                        {
                            name: reqBody.fullname,
                            email: reqBody.email,
                            phoneNumber: reqBody.phoneNumber,
                            uid: userRecord.uid,
                            profileImageUrl: reqBody.photoURL
                        }, reqBody.phoneNumber).then(clientRef => {
                            console.log(reqBody)
                            console.log('58');
                            const addtoUser =
                                addDataToUser(userRecord.uid,
                                    {
                                        Role: "user",
                                        client: clientData.phoneNumber,
                                        emailAddress: clientData.email,
                                    }
                                )
                                    .then(() => {
                                        return handleResponse(200, "Client Successfully created");
                                    })
                                    .catch(userRefError => {
                                        console.log(userRefError);
                                        return handleResponse(409, userRefError);
                                    });
                            return addtoUser;
                        })
                        .catch(clientReferror => {
                            console.log(clientReferror);
                            return handleResponse(409, clientReferror);
                        });
                    return addtoClients;
                })
                .catch(error => {
                    console.log(error);
                    return handleResponse(409, error);
                });
            return createUser;
        });
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
}


export const emailVerification = functions.auth.user().onCreate((user) => {
    return admin.auth().updateUser(user.uid, {
        emailVerified: true,
    })
});

export const deleteUserListener = functions.firestore.document('users/{users}').onDelete(
    (change, context) => {
        return admin.auth().deleteUser(change.id);
    }
)

export const emailValid = functions.https.onRequest(async (req, res) => {
    return validEmailCheck(req, res);
});
export const phoneNumberValid = functions.https.onRequest(async (req, res) => {
    return phoneNumberValidCheck(req, res);
});

function validEmailCheck(req: any, res: any) {
    const handleError = (error: Error) => {
        return res.status(500).send(error);
    };

    const handleResponse = (status: any, body?: any) => {
        if (body) {
            console.log(117);
            console.log(body);
            // return res.s
            return res.status(status).send(body);
        }
        return res.sendStatus(status);
    };
    try {
        corsHandler(req, res, () => {
            if (req.method !== "POST") {
                return handleResponse(403);
            }
            const reqBody = req.body;
            console.log(reqBody.email);
            admin.auth().getUserByEmail(reqBody.email).then(
                emailData => {
                    return handleResponse('409', 'Email exists on the system')
                }
            ).catch(
                emaildata => {
                    return handleResponse('200', 'Valid Email')
                }
            );


        });
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
}
function phoneNumberValidCheck(req: any, res: any) {
    const handleError = (error: Error) => {
        return res.status(500).send(error);
    };

    const handleResponse = (status: any, body?: any) => {
        if (body) {
            console.log(117);
            console.log(body);
            // return res.s
            return res.status(status).send(body);
        }
        return res.sendStatus(status);
    };
    try {
        corsHandler(req, res, () => {
            if (req.method !== "POST") {
                return handleResponse(403);
            }
            const reqBody = req.body;
            console.log(reqBody.phoneNumber);
            admin.auth().getUserByPhoneNumber(reqBody.phoneNumber).then(
                phoneData => {
                    return handleResponse('409', 'Phone exists on the system')
                }
            ).catch(
                phonedata => {
                    return handleResponse('200', 'Valid Phone Number')
                }
            );


        });
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
}

export const updateClientsDetailsListener = functions.firestore.document('clients/{clients}').onUpdate(
    async (change, context) => {
        const oldData = change.before.data() as Contact;
        const newData = change.after.data() as Contact;
        const clientId = context.params.clients;


        const associations = await associationService.getContactsAssociations(clientId);
        if (oldData.name !== newData.name || oldData.profileImageUrl !== newData.profileImageUrl) {
            let newClientDataObject = {
                name: newData.name,
                profileImageUrl: newData.profileImageUrl
            }
            const associationsData = associations.contacts;
            associationsData.forEach((association: string) => {
                db.collection("clients").doc(association).collection("contacts").doc(clientId).update(newClientDataObject).then(updateSuccess => {
                    console.log(`update success for clientId ${clientId} of contact ${association}`);
                    return updateSuccess;
                }).catch(error => {
                    console.log(`Error occured ${error}`);
                    return error;
                })
            })
        }
        return change;

    })


import * as cors from 'cors';
import * as admin from "firebase-admin";
export const auth = admin.auth();
export const corsOptions: cors.CorsOptions = {
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "X-Access-Token"
    ],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: true,
    preflightContinue: false
};
export const db = admin.firestore();
export enum fireBaseCollName {
    USER = 'users'
};
// export const hostDomainName="https://app.trackify.com.au/";

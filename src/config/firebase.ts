import admin from "firebase-admin";
import { env } from "./env";

const initializeFirebaseAdmin = ():void  => {
    if(admin.apps.length > 0) return 

    const {  FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = env

    if(!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL){
        throw new Error("FAILURE INITIALIZING FIREBASE - MISSING CREDENTIALS")
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: FIREBASE_PROJECT_ID,
                clientEmail: FIREBASE_CLIENT_EMAIL,
                privateKey: FIREBASE_PRIVATE_KEY
            }),
        });
    } catch (err) {
        console.error("FAIL TO CONNECT WITH FIREBASE", err);     
        process.exit(1); 
    }
};

export default initializeFirebaseAdmin;
import firebase from "firebase/compat/app";
import "firebase/compat/messaging";
import { firebaseConfig } from "./fireabaseConfig";
import { callRequest } from "./utils/requests";
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

var messaging;
try {
    messaging = firebase.messaging();
} catch (err) {
    console.error("Failed to initialize Firebase Messaging", err);
}

export const getMessagingToken = async () => {
    const token = sessionStorage.getItem("firebase_token");
    if (token) {
        console.log("Token is: " + token);
        return token;
    }
    if (!messaging) return "";
    try {
        const currentToken = await messaging.getToken({
            vapidKey:
                "BCBI3758ROCNUcL24lAtABq_a0cB-xLe7vyPUJRykAx5XaDXUm4hnZbGzZRl8OpIsA4qkk2uge1oLlLkDqCFln8",
        });
        saveTokenToDb(currentToken);
        return currentToken;
    } catch (error) {
        console.log("An error occurred while retrieving token. ", error);
        return "";
    }
};

const saveTokenToDb = (token) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

    var raw = JSON.stringify({ token });

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    callRequest("notification/token", requestOptions)
        .then(() => {
            sessionStorage.setItem("firebase_token", token);
        })
        .catch(() => {});
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        messaging &&
            messaging.onMessage((payload) => {
                resolve(payload);
            });
    });

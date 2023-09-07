import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./Redux/app/store";
import { BrowserProvider } from "./context/BrowserContext";
import { NotificationProvider } from "./context/NotificationContext";
import { UserProvider } from "./context/userContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <BrowserProvider>
                    <NotificationProvider>
                        <GoogleOAuthProvider clientId='361938334896-2s1t9e8ic43qtrrd7jkgccjmpvfio79n.apps.googleusercontent.com'>
                            <UserProvider>
                                <App />
                            </UserProvider>
                        </GoogleOAuthProvider>
                    </NotificationProvider>
                </BrowserProvider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);

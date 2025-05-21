import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ApiProvider from "./ApiClient.tsx";

function getDivId(): string {
    const me = document.querySelector('script[data-id][data-name="form-script"]');
    const id = me?.getAttribute('data-id');
    return id ?? '__inject-form';
}

let isStarted = false;

function start() {
    if (isStarted) {
        return;
    }
    isStarted = true;
    ReactDOM.createRoot(document.getElementById(getDivId())!).render(
        <React.StrictMode>
            <ApiProvider>
                <App/>
            </ApiProvider>
        </React.StrictMode>,
    )
}

if (document.readyState === 'complete') {
    start();
} else {
    window.addEventListener('load', start);
}

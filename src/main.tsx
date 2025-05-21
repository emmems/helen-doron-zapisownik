import posthog from 'posthog-js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ApiProvider from "./ApiClient.tsx";
import App from './App.tsx';
import './index.css';

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
    posthog.init('phc_YhijBdWr9yOyrvYaeoN3DkpSuk3afl2WneybdCBQQ8c',
        {
            api_host: 'https://helen-doron-posthog.emems.workers.dev',
            person_profiles: 'always'
        }
    )
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

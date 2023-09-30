/* root index.js file with react DOM */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import '@fontsource/public-sans';
import { AuthContextProvider } from './utils/authentication/auth-context';

/* Render react root */
const root = document.getElementById('root');
const reactRoot = ReactDOM.createRoot(root);
reactRoot.render(
    <React.StrictMode>
        <AuthContextProvider> {/* for authentication context */}
            <App />
        </AuthContextProvider>
    </React.StrictMode>
);
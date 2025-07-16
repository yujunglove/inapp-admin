import React from 'react';
import { createRoot } from 'react-dom/client';
import InAppModule from './InAppModule.jsx';
import './app.css';

export function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return;
    }

    const root = createRoot(container);
    root.render(<InAppModule />);
}
import React from 'react';
import ReactDOM from 'react-dom/client';
import InAppModule from './InAppModule';

// 렌더 함수 export
export const render = (containerId, config = {}) => {
    const container = typeof containerId === 'string'
        ? document.getElementById(containerId)
        : containerId;

    if (!container) {
        console.error(`Container '${containerId}' not found`);
        return null;
    }

    // React 18 방식
    const root = ReactDOM.createRoot(container);
    root.render(
        <InAppModule
            config={config}
            onDataChange={config.onDataChange || (() => {})}
            initialData={config.initialData || null}
        />
    );

    return root;
};
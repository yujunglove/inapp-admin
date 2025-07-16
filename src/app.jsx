import React from 'react';
import { createRoot } from 'react-dom/client';
import InAppModule from './InAppModule.jsx';
import './app.css';

// 전역으로 root 인스턴스 관리
const rootInstances = new Map();

export function render(containerId, config = {}, callbacks = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return;
    }

    // 기존 root가 있으면 언마운트
    if (rootInstances.has(containerId)) {
        rootInstances.get(containerId).unmount();
    }

    // 새로운 root 생성
    const root = createRoot(container);
    rootInstances.set(containerId, root);

    // callbacks 분해
    const { onDataChange, onError, onLoad } = callbacks;

    // 컴포넌트 렌더링
    root.render(
        <InAppModule 
            config={config}
            onDataChange={onDataChange}
            onError={onError}
            onLoad={onLoad}
        />
    );

    // onLoad 콜백 호출
    if (typeof onLoad === 'function') {
        setTimeout(() => {
            onLoad();
        }, 100);
    }
}
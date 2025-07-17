import React from 'react';

const JsonModal = ({ show, jsonData, onClose, onCopy }) => {
    if (!show) return null;

    const handleCopy = () => {
        const jsonString = JSON.stringify(jsonData, null, 2);
        navigator.clipboard.writeText(jsonString).then(() => {
            alert('JSON이 클립보드에 복사되었습니다!');
            onCopy();
        });
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '24px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                        JSON 데이터
                    </h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            type="button"
                            onClick={handleCopy}
                            style={{
                                padding: '8px 16px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                            </svg>
                            복사
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                color: '#6b7280'
                            }}
                        >
                            ×
                        </button>
                    </div>
                </div>
                <pre style={{
                    background: '#f8f9fa',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '16px',
                    fontSize: '12px',
                    fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    color: '#1f2937',
                    overflow: 'auto',
                    lineHeight: '1.5',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    maxHeight: '400px'
                }}>
                    {jsonData ? JSON.stringify(jsonData, null, 2) : '데이터가 없습니다.'}
                </pre>
            </div>
        </div>
    );
};

export default JsonModal;
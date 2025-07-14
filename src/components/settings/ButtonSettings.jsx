// components/settings/ButtonSettings.jsx - 동적 버튼 관리 (완전 버전)
import React from 'react';

export const ButtonSettings = ({
                                   settings,
                                   buttons,
                                   validationErrors,
                                   urlValidation,
                                   canToggle,
                                   onToggle,
                                   onUpdateButton,
                                   onAddButton,
                                   onRemoveButton,
                                   onUrlValidation,
                                   showToast,
                                   maxButtons = 2
                               }) => {
    const handleUrlChange = (buttonId, url) => {
        onUpdateButton(buttonId, 'url', url);
        onUrlValidation(url, 'url', buttonId);
    };

    const getButtonKeyId = () => {
        // 버튼 설정의 고유 키 생성
        return 'button_settings';
    };

    return (
        <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
            }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937'
                }}>
                    버튼 설정
                </h3>

                {canToggle && (
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}>
                        <input
                            type="checkbox"
                            checked={settings.buttonEnabled}
                            onChange={() => onToggle('buttonEnabled')}
                            style={{
                                width: '20px',
                                height: '20px',
                                cursor: 'pointer'
                            }}
                        />
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                            버튼 사용
                        </span>
                    </label>
                )}
            </div>

            {settings.buttonEnabled && (
                <div>
                    {/* 버튼 추가 영역 */}
                    {buttons.length < maxButtons && (
                        <div style={{
                            marginBottom: '16px',
                            padding: '16px',
                            border: '2px dashed #d1d5db',
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <button
                                onClick={onAddButton}
                                style={{
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    margin: '0 auto'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12h14"/>
                                </svg>
                                버튼 추가 ({buttons.length}/{maxButtons})
                            </button>
                        </div>
                    )}

                    {/* 버튼 목록 */}
                    {buttons.map((button, index) => (
                        <div
                            key={button.id}
                            id={`qdx_btn_${getButtonKeyId()}_${index + 1}`}
                            style={{
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '20px',
                                marginBottom: '16px',
                                position: 'relative'
                            }}
                        >
                            {/* 삭제 버튼 */}
                            <button
                                onClick={() => onRemoveButton(button.id)}
                                style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px'
                                }}
                                title="버튼 삭제"
                            >
                                ×
                            </button>

                            <h4 style={{
                                margin: '0 0 16px 0',
                                fontSize: '16px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                버튼 {index + 1}
                            </h4>

                            {/* 버튼 텍스트 */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151'
                                }}>
                                    버튼 텍스트 *
                                </label>
                                <input
                                    type="text"
                                    value={button.text}
                                    onChange={(e) => onUpdateButton(button.id, 'text', e.target.value)}
                                    placeholder="버튼에 표시될 텍스트를 입력하세요"
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: validationErrors[`button_${button.id}_text`] ? '2px solid #ef4444' : '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease'
                                    }}
                                />
                                {validationErrors[`button_${button.id}_text`] && (
                                    <p style={{
                                        color: '#ef4444',
                                        fontSize: '12px',
                                        margin: '4px 0 0 0'
                                    }}>
                                        {validationErrors[`button_${button.id}_text`]}
                                    </p>
                                )}
                            </div>

                            {/* 버튼 URL */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151'
                                }}>
                                    링크 URL
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="url"
                                        value={button.url}
                                        onChange={(e) => handleUrlChange(button.id, e.target.value)}
                                        placeholder="https://example.com"
                                        style={{
                                            width: '100%',
                                            padding: '10px 40px 10px 12px',
                                            border: validationErrors[`button_${button.id}_url`] ? '2px solid #ef4444' : '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            outline: 'none',
                                            transition: 'border-color 0.2s ease'
                                        }}
                                    />
                                    {button.url && (
                                        <div style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }}>
                                            {urlValidation.buttons[button.id] ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                                                    <path d="M20 6L9 17l-5-5"/>
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                                    <path d="M18 6L6 18M6 6l12 12"/>
                                                </svg>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {validationErrors[`button_${button.id}_url`] && (
                                    <p style={{
                                        color: '#ef4444',
                                        fontSize: '12px',
                                        margin: '4px 0 0 0'
                                    }}>
                                        {validationErrors[`button_${button.id}_url`]}
                                    </p>
                                )}
                            </div>

                            {/* 링크 타겟 */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151'
                                }}>
                                    링크 열기 방식
                                </label>
                                <select
                                    value={button.target}
                                    onChange={(e) => onUpdateButton(button.id, 'target', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        background: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="current">현재 창에서 열기</option>
                                    <option value="new">새 창에서 열기</option>
                                </select>
                            </div>
                        </div>
                    ))}

                    {buttons.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: '#6b7280',
                            fontSize: '14px'
                        }}>
                            버튼을 추가해주세요.
                        </div>
                    )}
                </div>
            )}

            {!settings.buttonEnabled && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#6b7280',
                    fontSize: '14px'
                }}>
                    버튼을 사용하려면 위의 토글을 활성화해주세요.
                </div>
            )}
        </div>
    );
};
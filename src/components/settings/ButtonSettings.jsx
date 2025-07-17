import React from 'react';
import { ToggleBox, RadioButton } from '../UIComponents';
import { handleUrlCheck } from '../../utils/ValidationUtils';

export const ButtonSettings = ({
    settings,
    buttons,
    validationErrors,
    urlValidation,
    canToggle = true,
    onToggle,
    onUpdateButton,
    onUrlValidation,
    showToast,
    onAddButton,
    onRemoveButton
}) => {
    const maxButtons = 2;
    const canAdd = buttons.length < maxButtons;
    const canRemove = buttons.length > 1;
    const enabled = !!settings.buttonEnabled;

    return (
        <div style={{
            border: enabled ? '1px solid #169DAF33' : '1px solid #e5e7eb',
            borderRadius: '18px',
            boxShadow: enabled
                ? '0 1px 4px 0 rgba(22,157,175,0.18)'
                : '0 1px 4px 0 rgba(181, 181, 181, 0.14)',
            marginBottom: '32px',
            background: 'white',
            transition: 'box-shadow .18s cubic-bezier(.4,0,.2,1)'
        }}>
            <div style={{
                background: enabled
                    ? 'linear-gradient(30deg, #e4f5fa 0%, #c0e6ef 60%, #fafdff 100%)'
                    : '#f3f6f8',
                padding: '20px 28px 14px 28px',
                borderRadius: '18px 18px 0px 0px',
                borderBottom: enabled ? '1.5px solid #169DAF33' : '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h4 style={{
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: 700,
                        color: enabled ? '#0e636e' : '#8ba7b3',
                        letterSpacing: '-0.5px',
                        transition: 'color .18s'
                    }}>
                        버튼 설정
                    </h4>
                    <p style={{
                        margin: '7px 0 0 0',
                        fontSize: '12px',
                        color: enabled ? '#4a4e56' : '#b0b8c2',
                        fontWeight: 400,
                        opacity: enabled ? 0.92 : 0.7,
                        transition: 'color .18s, opacity .18s'
                    }}>
                        액션 버튼을 추가하고 설정합니다
                        <span style={{
                            fontSize: '12px', color: '#a0aec0', marginLeft: '8px'
                        }}>(최대 {maxButtons}개)</span>
                    </p>
                </div>
                {canToggle && (
                    <ToggleBox
                        checked={settings.buttonEnabled}
                        onChange={() => onToggle('buttonEnabled')}
                    />
                )}
            </div>
            {enabled ? (
                <div style={{
                    padding: '22px 18px 18px 18px',
                    background: '#fff',
                    borderRadius: '0 0 18px 18px',
                    maxHeight: '500px',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
                }}
                className="button-settings-content"
                >
                    <style>
                        {`
                            .button-settings-content::-webkit-scrollbar {
                                width: 6px;
                            }
                            .button-settings-content::-webkit-scrollbar-track {
                                background: transparent;
                            }
                            .button-settings-content::-webkit-scrollbar-thumb {
                                background: rgba(156, 163, 175, 0.5);
                                border-radius: 3px;
                            }
                            .button-settings-content::-webkit-scrollbar-thumb:hover {
                                background: rgba(156, 163, 175, 0.8);
                            }
                        `}
                    </style>
                    {buttons.map((button, index) => (
                        <div key={button.id} style={{
                            border: '1px solid #e5e7eb',
                            padding: '20px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            background: '#f9fafb',
                            position: 'relative'
                        }}>
                            {canRemove && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onRemoveButton(button.id);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: '#e5e7eb',
                                        color: '#ef4444',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    title="버튼 삭제"
                                >-</button>
                            )}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '16px'
                            }}>
                                <h6 style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#4a4e56' }}>
                                    버튼 {index + 1}
                                </h6>
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                }}>
                                    버튼 텍스트
                                </label>
                                <input
                                    type="text"
                                    placeholder="버튼 텍스트 입력"
                                    value={button.text}
                                    onChange={(e) => onUpdateButton(button.id, 'text', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: `1px solid ${validationErrors[`button_${button.id}_text`] ? '#dc2626' : '#d1d5db'}`,
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box',
                                        background: validationErrors[`button_${button.id}_text`] ? '#fef2f2' : 'white'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '6px'
                                }}>
                                    <label style={{ fontSize: '12px', fontWeight: '500' }}>링크 URL</label>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleUrlCheck(button.url, (message) => showToast(message, e));
                                            onUrlValidation(button.url, 'url', button.id);
                                        }}
                                        style={{
                                            padding: '4px 8px',
                                            background: 'rgb(249, 250, 251)',
                                            color: 'rgb(107, 114, 128)',
                                            border: '1px solid rgb(229, 231, 235)',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            transform: 'translateY(0)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#e5e7eb';
                                            e.target.style.transform = 'translateY(-1px)';
                                            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgb(249, 250, 251)';
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        <label style={{ display: 'block', fontWeight: '700' }}>링크 검증</label>
                                    </button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        placeholder="https://example.com"
                                        value={button.url}
                                        onChange={(e) => onUpdateButton(button.id, 'url', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: `1px solid ${validationErrors[`button_${button.id}_url`] || urlValidation.errors?.[`button_${button.id}_url`] ? '#dc2626' : '#d1d5db'}`,
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            boxSizing: 'border-box',
                                            background: (validationErrors[`button_${button.id}_url`] || urlValidation.errors?.[`button_${button.id}_url`]) ? '#fef2f2' : 'white',
                                            paddingRight: urlValidation.buttons[button.id] ? '40px' : '16px'
                                        }}
                                    />
                                    {urlValidation.buttons[button.id] && (
                                        <div style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#10b981',
                                            fontSize: '16px'
                                        }}>
                                            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>
                                    링크 열기
                                </label>
                                <RadioButton
                                    options={[
                                        { value: 'current', label: '현재창' },
                                        { value: 'new', label: '새창' }
                                    ]}
                                    value={button.target}
                                    onChange={(value) => onUpdateButton(button.id, 'target', value)}
                                    name={`buttonTarget_${button.id}`}
                                />
                            </div>
                        </div>
                    ))}
                    <div style={{ textAlign: 'center', marginTop: '12px' }}>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onAddButton();
                            }}
                            disabled={!canAdd}
                            style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                border: '1px solid #e5e7eb',
                                background: canAdd ? '#f5f9fc' : '#f1f5f9',
                                color: canAdd ? '#169DAF' : '#c9c9c9',
                                fontSize: '22px',
                                cursor: canAdd ? 'pointer' : 'not-allowed',
                                fontWeight: 'bold'
                            }}
                            title="버튼 추가"
                        >+</button>
                    </div>
                </div>
            ) : (
                <div style={{
                    padding: '36px 28px 36px 28px',
                    background: '#f9fafb',
                    borderRadius: '0 0 18px 18px',
                    textAlign: 'center',
                    color: '#adbcc6',
                    fontSize: '12px',
                    fontWeight: 400,
                    letterSpacing: '-0.2px'
                }}>
                    버튼 입력이 비활성화되어 있습니다.
                </div>
            )}
        </div>
    );
};
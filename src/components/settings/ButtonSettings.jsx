import React from 'react';
import { ToggleBox, RadioButton } from '../UIComponents';
import { handleUrlCheck } from '../../utils/ValidationUtils';

/**
 * 버튼 설정 컴포넌트
 */
export const ButtonSettings = ({
                                   settings,
                                   buttons,
                                   validationErrors,
                                   urlValidation,
                                   canToggle = true, // 기본값 추가
                                   onToggle,
                                   onUpdateButton,
                                   onUrlValidation,
                                   showToast
                               }) => {
    return (
        <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            marginBottom: '24px'
        }}>
            <div style={{
                background: settings.buttonEnabled ? '#f5f9fc' : '#f9fafb',
                padding: '16px 24px',
                borderBottom: settings.buttonEnabled ? '1px solid #e5e7eb' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '12px 12px 0px 0px',
            }}>
                <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>버튼 설정</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                        액션 버튼을 추가하고 설정합니다
                    </p>
                </div>
                {canToggle && (
                    <ToggleBox
                        checked={settings.buttonEnabled}
                        onChange={() => onToggle('buttonEnabled')}
                    />
                )}
            </div>

            {settings.buttonEnabled && (
                <div style={{ padding: '24px' }}>
                    {buttons.map((button, index) => (
                        <div key={button.id} style={{
                            border: '1px solid #d1d5db',
                            padding: '20px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            background: '#f9fafb'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '16px'
                            }}>
                                <h6 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
                                    버튼 {index + 1}
                                </h6>
                            </div>

                            {/* 버튼 텍스트 */}
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '14px',
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

                            {/* 링크 URL */}
                            <div style={{ marginBottom: '12px' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '6px'
                                }}>
                                    <label style={{ fontSize: '14px', fontWeight: '500' }}>링크 URL</label>
                                    <button
                                        onClick={() => {
                                            handleUrlCheck(button.url, showToast);
                                            onUrlValidation(button.url, 'url', button.id);
                                        }}
                                        style={{
                                            padding: '4px 8px',
                                            background: 'rgb(249, 250, 251)',
                                            color: 'rgb(107, 114, 128)',
                                            border: '1px solid rgb(229, 231, 235)',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            cursor: 'pointer'
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
                                            border: `1px solid ${validationErrors[`button_${button.id}_url`] ? '#dc2626' : '#d1d5db'}`,
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            boxSizing: 'border-box',
                                            background: validationErrors[`button_${button.id}_url`] ? '#fef2f2' : 'white',
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

                            {/* 링크 열기 */}
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
                </div>
            )}
        </div>
    );
};
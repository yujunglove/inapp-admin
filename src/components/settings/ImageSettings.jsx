import React from 'react';
import { ToggleBox, RadioButton, CustomSelect } from '../UIComponents';
import { handleUrlCheck, isValidUrl } from '../../utils/ValidationUtils';

/**
 * 이미지 설정 컴포넌트
 */
export const ImageSettings = ({
                                  settings,
                                  validationErrors,
                                  urlValidation,
                                  displayType,
                                  canToggle,
                                  onToggle,
                                  onInputChange,
                                  onUrlValidation,
                                  showToast
                              }) => {
    return (
        <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            marginBottom: '24px',
        }}>
            <div style={{
                background: settings.imageEnabled ? '#f5f9fc' : '#f9fafb',
                padding: '16px 24px',
                borderBottom: settings.imageEnabled ? '1px solid #e5e7eb' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '12px 12px 0px 0px',
            }}>
                <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>이미지 설정</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                        이미지를 추가하고 설정합니다
                    </p>
                </div>
                {canToggle && (
                    <ToggleBox
                        checked={settings.imageEnabled}
                        onChange={() => onToggle('imageEnabled')}
                    />
                )}
            </div>

            {settings.imageEnabled && (
                <div style={{ padding: '24px' }}>
                    {/* 이미지 URL */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <label style={{ fontWeight: '500', margin: 0 }}>이미지 URL</label>
                            <button
                                onClick={() => {
                                    handleUrlCheck(settings.imageUrl, showToast);
                                    onUrlValidation(settings.imageUrl, 'imageUrl');
                                }}
                                style={{
                                    padding: '4px 8px', background: 'rgb(249, 250, 251)', color: 'rgb(107, 114, 128)',
                                    border: '1px solid rgb(229, 231, 235)', borderRadius: '4px', fontSize: '12px', cursor: 'pointer'
                                }}
                            >
                                <label style={{ display: 'block', fontWeight: '700' }}>링크 검증</label>
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={settings.imageUrl}
                                onChange={(e) => onInputChange('imageUrl', e.target.value)}
                                placeholder="예) https://media.istockphoto.com/id/590153468/ko"
                                style={{
                                    width: '100%',
                                    height: '44px',
                                    padding: '12px 16px',
                                    border: `1px solid ${validationErrors.imageUrl ? '#dc2626' : '#d1d5db'}`,
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    background: validationErrors.imageUrl ? '#fef2f2' : 'white',
                                    paddingRight: urlValidation.imageUrl ? '40px' : '16px',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {urlValidation.imageUrl && (
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

                    {/* 클릭동작 */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>클릭동작</label>
                        <CustomSelect
                            value={settings.clickAction}
                            onChange={(value) => onInputChange('clickAction', value)}
                            options={[
                                { value: '', label: '없음' },
                                { value: 'link', label: '링크' }
                            ]}
                            placeholder="없음"
                        />
                    </div>

                    {/* 링크 설정 */}
                    {settings.clickAction === 'link' && (
                        <>
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label style={{ fontWeight: '500', margin: 0 }}>링크 URL</label>
                                    <button
                                        onClick={() => {
                                            handleUrlCheck(settings.linkUrl, showToast);
                                            onUrlValidation(settings.linkUrl, 'linkUrl');
                                        }}
                                        style={{
                                            padding: '4px 8px', background: 'rgb(249, 250, 251)', color: 'rgb(107, 114, 128)',
                                            border: '1px solid rgb(229, 231, 235)', borderRadius: '4px', fontSize: '12px', cursor: 'pointer'
                                        }}
                                    >
                                        <label style={{ display: 'block', fontWeight: '700' }}>링크 검증</label>
                                    </button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={settings.linkUrl}
                                        onChange={(e) => onInputChange('linkUrl', e.target.value)}
                                        placeholder="예) https://www.example.com"
                                        style={{
                                            width: '100%',
                                            height: '44px',
                                            padding: '12px 16px',
                                            border: `1px solid ${validationErrors.linkUrl ? '#dc2626' : '#d1d5db'}`,
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            background: validationErrors.linkUrl ? '#fef2f2' : 'white',
                                            paddingRight: urlValidation.linkUrl ? '40px' : '16px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                    {urlValidation.linkUrl && (
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

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>링크 열기</label>
                                <RadioButton
                                    options={[
                                        { value: 'current', label: '현재창' },
                                        { value: 'new', label: '새창' }
                                    ]}
                                    value={settings.linkTarget}
                                    onChange={(value) => onInputChange('linkTarget', value)}
                                    name="linkTarget"
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
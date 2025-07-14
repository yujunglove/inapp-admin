import React from 'react';
import { ToggleBox } from '../UIComponents';
import TipTapEditor from '../TipTapEditor';

/**
 * 텍스트 설정 컴포넌트
 */
export const TextSettings = ({
                                 settings,
                                 validationErrors,
                                 canToggle = true, // 기본값 추가
                                 onToggle,
                                 onRichTextChange,
                                 onRichTextClick
                             }) => {
    return (
        <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            marginBottom: '24px'
        }}>
            <div style={{
                background: settings.textEnabled ? '#f5f9fc' : '#f9fafb',
                padding: '16px 24px',
                borderBottom: settings.textEnabled ? '1px solid #e5e7eb' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '12px 12px 0px 0px',
            }}>
                <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>텍스트 설정</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                        제목과 본문을 설정합니다 (서식 지원)
                    </p>
                </div>
                <ToggleBox
                    checked={settings.textEnabled}
                    onChange={() => onToggle('textEnabled')}
                />
            </div>

            {settings.textEnabled && (
                <div style={{ padding: '24px' }}>
                    <div
                        style={{
                            borderRadius: '8px',
                            background: validationErrors.titleContent ? '#fef2f2' : 'transparent',
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => onRichTextClick('titleContent')}
                    >
                        <TipTapEditor
                            titleValue={settings.titleContent || ''}
                            bodyValue={settings.bodyContent || ''}
                            onTitleChange={(value) => onRichTextChange('titleContent', value)}
                            onBodyChange={(value) => onRichTextChange('bodyContent', value)}
                            showTitle={true}
                            showBody={true}
                        />
                    </div>

                    {validationErrors.titleContent && (
                        <div style={{
                            color: '#dc2626',
                            fontSize: '12px',
                            marginTop: '4px',
                            fontWeight: '500'
                        }}>
                            ⚠️ 제목을 입력해주세요
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
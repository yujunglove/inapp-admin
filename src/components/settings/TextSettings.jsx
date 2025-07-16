import React from 'react';
import { ToggleBox } from '../UIComponents';
import TipTapEditor from '../TipTapEditor';

/**
 * 텍스트 설정 컴포넌트 (LocationSettings 스타일 통일)
 */
export const TextSettings = ({
                                 settings,
                                 validationErrors,
                                 canToggle = true,
                                 onToggle,
                                 onRichTextChange,
                                 onRichTextClick
                             }) => {
    const enabled = !!settings.textEnabled;

    return (
        <div style={{
            border: enabled ? '1px solid #169DAF33' : '1px solid #e5e7eb',
            borderRadius: '18px',
            boxShadow:  enabled
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
                        fontSize: '18px',
                        fontWeight: 700,
                        color: enabled ? '#0e636e' : '#8ba7b3',
                        letterSpacing: '-0.5px',
                        transition: 'color .18s'
                    }}>
                        텍스트 설정
                    </h4>
                    <p style={{
                        margin: '7px 0 0 0',
                        fontSize: '15px',
                        color: enabled ? '#4a4e56' : '#b0b8c2',
                        fontWeight: 400,
                        opacity: enabled ? 0.92 : 0.72,
                        transition: 'color .18s, opacity .18s'
                    }}>
                        제목과 본문을 설정합니다 (서식 지원)
                    </p>
                </div>
                {canToggle && (
                    <ToggleBox
                        checked={enabled}
                        onChange={() => onToggle('textEnabled')}
                    />
                )}
            </div>
            {enabled ? (
                <div style={{
                    padding: '32px 28px 28px 28px',
                    background: '#fff',
                    borderRadius: '0 0 18px 18px'
                }}>
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
            ) : (
                <div style={{
                    padding: '36px 28px 36px 28px',
                    background: '#f9fafb',
                    borderRadius: '0 0 18px 18px',
                    textAlign: 'center',
                    color: '#adbcc6',
                    fontSize: '15px',
                    fontWeight: 400,
                    letterSpacing: '-0.2px'
                }}>
                    텍스트 입력이 비활성화되어 있습니다.
                </div>
            )}
        </div>
    );
};

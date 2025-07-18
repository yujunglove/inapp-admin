import React from 'react';
import { ToggleBox } from '../UIComponents';
import TipTapEditor from '../TipTapEditor';
import { 
  getCardStyle, 
  getCardHeaderStyle, 
  getCardTitleStyle, 
  getCardDescriptionStyle, 
  getCardContentStyle,
  commonStyles
} from '../../styles/commonStyles.jsx';

/**
 * 텍스트 설정 컴포넌트
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
        <div style={getCardStyle(enabled)}>
            <div style={getCardHeaderStyle(enabled)}>
                <div>
                    <h4 style={getCardTitleStyle(enabled)}>
                        텍스트 설정
                    </h4>
                    <p style={getCardDescriptionStyle(enabled)}>
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
                <div style={getCardContentStyle(enabled)}
                className="text-settings-content"
                >
                    <style>
                        {/* 스크롤 관련 스타일 제거 */}
                    </style>
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
                <div style={getCardContentStyle(enabled)}>
                    텍스트 입력이 비활성화되어 있습니다.
                </div>
            )}
        </div>
    );
};
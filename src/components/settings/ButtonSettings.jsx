import React from 'react';
import { ToggleBox, RadioButton } from '../UIComponents';
import { handleUrlCheck } from '../../utils/ValidationUtils';
import { 
  getCardStyle, 
  getCardHeaderStyle, 
  getCardTitleStyle, 
  getCardDescriptionStyle, 
  getCardContentStyle,
  getInputStyle,
  commonStyles,
  CheckIcon
} from '../../styles/commonStyles.jsx';

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
        <div style={getCardStyle(enabled)}>
            <div style={getCardHeaderStyle(enabled)}>
                <div>
                    <h4 style={getCardTitleStyle(enabled)}>
                        버튼 설정
                    </h4>
                    <p style={getCardDescriptionStyle(enabled)}>
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
                    ...getCardContentStyle(enabled),
                    ...commonStyles.scrollArea.base
                }}
                className="button-settings-content"
                >
                    <style>
                        {commonStyles.scrollArea.webkit}
                    </style>
                    {buttons.map((button, index) => (
                        <div key={button.id} style={commonStyles.itemBox.base}>
                            {canRemove && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onRemoveButton(button.id);
                                    }}
                                    style={commonStyles.button.removeButton}
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
                                <label style={commonStyles.label.base}>
                                    버튼 텍스트
                                </label>
                                <input
                                    type="text"
                                    placeholder="버튼 텍스트 입력"
                                    value={button.text}
                                    onChange={(e) => onUpdateButton(button.id, 'text', e.target.value)}
                                    style={getInputStyle(validationErrors[`button_${button.id}_text`])}
                                />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '6px'
                                }}>
                                    <label style={commonStyles.label.base}>링크 URL</label>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleUrlCheck(button.url, (message) => showToast(message, e));
                                            onUrlValidation(button.url, 'url', button.id);
                                        }}
                                        style={commonStyles.button.base}
                                        onMouseEnter={(e) => {
                                            Object.assign(e.target.style, commonStyles.button.hover);
                                        }}
                                        onMouseLeave={(e) => {
                                            Object.assign(e.target.style, commonStyles.button.base);
                                        }}
                                    >
                                        링크 검증
                                    </button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        placeholder="https://example.com"
                                        value={button.url}
                                        onChange={(e) => onUpdateButton(button.id, 'url', e.target.value)}
                                        style={getInputStyle(
                                            validationErrors[`button_${button.id}_url`] || urlValidation.errors?.[`button_${button.id}_url`],
                                            urlValidation.buttons[button.id]
                                        )}
                                    />
                                    {urlValidation.buttons[button.id] && (
                                        <div style={commonStyles.checkIcon.container}>
                                            <CheckIcon />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label style={{
                                    ...commonStyles.label.base,
                                    fontSize: '14px'
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
                                ...commonStyles.button.addButton,
                                ...(canAdd ? {} : {
                                    background: '#f1f5f9',
                                    color: '#c9c9c9',
                                    cursor: 'not-allowed'
                                })
                            }}
                            title="버튼 추가"
                        >+</button>
                    </div>
                </div>
            ) : (
                <div style={getCardContentStyle(enabled)}>
                    버튼 입력이 비활성화되어 있습니다.
                </div>
            )}
        </div>
    );
};
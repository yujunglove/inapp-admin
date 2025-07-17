import React, { useState, useEffect } from 'react';
import { ToggleBox, RadioButton, CustomSelect } from '../UIComponents';
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

export const ImageSettings = ({
    settings,
    validationErrors,
    urlValidation,
    displayType,
    canToggle = true,
    onToggle,
    onInputChange,
    onUrlValidation,
    showToast,
    onImagesChange
}) => {
    const enabled = !!settings.imageEnabled;
    const isSlideType = displayType?.toUpperCase() === 'SLIDE';
    
    const [images, setImages] = useState([]);
    const [nextImageId, setNextImageId] = useState(1);

    useEffect(() => {
        if (isSlideType && enabled) {
            if (settings.images && Array.isArray(settings.images) && settings.images.length > 0) {
                setImages(settings.images);
                setNextImageId(settings.images.length + 1);
            } 
            else if (images.length === 0 && settings.imageUrl) {
                setImages([{
                    id: 1,
                    url: settings.imageUrl,
                    action: settings.clickAction || '',
                    linkUrl: settings.linkUrl || '',
                    linkTarget: settings.linkTarget || 'current'
                }]);
                setNextImageId(2);
            }
        }
    }, [isSlideType, enabled, settings.imageUrl, settings.images]);

    const addImage = () => {
        if (images.length < 5) {
            const newImage = {
                id: nextImageId,
                url: '',
                action: '',
                linkUrl: '',
                linkTarget: 'current'
            };
            setImages(prev => [...prev, newImage]);
            setNextImageId(prev => prev + 1);
        }
    };

    const removeImage = (imageId) => {
        setImages(prev => prev.filter(img => img.id !== imageId));
    };

    const updateImage = (imageId, field, value) => {
        setImages(prev => prev.map(img => 
            img.id === imageId ? { ...img, [field]: value } : img
        ));

        if (field === 'url') {
            onUrlValidation(value, `image_${imageId}_url`);
            if (onInputChange) {
                onInputChange('clearUrlError', { field: `image_${imageId}_url` });
            }
        } else if (field === 'linkUrl') {
            onUrlValidation(value, `image_${imageId}_linkUrl`);
            if (onInputChange) {
                onInputChange('clearUrlError', { field: `image_${imageId}_linkUrl` });
            }
        }
    };

    useEffect(() => {
        if (isSlideType && enabled) {
            onInputChange('images', images);
            if (onImagesChange) {
                onImagesChange(images);
            }
        }
    }, [images, isSlideType, enabled]);

    return (
        <div style={getCardStyle(enabled)}>
            <div style={getCardHeaderStyle(enabled)}>
                <div>
                    <h4 style={getCardTitleStyle(enabled)}>
                        이미지 설정 {isSlideType && '(최대 5개)'}
                    </h4>
                    <p style={getCardDescriptionStyle(enabled)}>
                        {isSlideType ? '슬라이드로 표시할 이미지를 추가하고 설정합니다' : '이미지를 추가하고 설정합니다'}
                    </p>
                </div>
                {canToggle && (
                    <ToggleBox
                        checked={enabled}
                        onChange={() => onToggle('imageEnabled')}
                    />
                )}
            </div>

            {enabled ? (
                <div style={getCardContentStyle(enabled)}>
                    {isSlideType ? (
                        <>
                            {images.map((image, index) => (
                                <div key={image.id} style={commonStyles.itemBox.base}>
                                    {images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeImage(image.id);
                                            }}
                                            style={commonStyles.button.removeButton}
                                            title="이미지 삭제"
                                        >-</button>
                                    )}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '16px'
                                    }}>
                                        <h6 style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#4a4e56' }}>
                                            이미지 {index + 1}
                                        </h6>
                                    </div>

                                    <div style={{ marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <label style={commonStyles.label.base}>이미지 URL</label>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleUrlCheck(image.url, (message) => showToast(message, e));
                                                    onUrlValidation(image.url, `image_${image.id}_url`);
                                                }}
                                                style={commonStyles.button.base}
                                                onMouseEnter={(e) => {
                                                    Object.assign(e.target.style, commonStyles.button.hover);
                                                }}
                                                onMouseLeave={(e) => {
                                                    Object.assign(e.target.style, commonStyles.button.base);
                                                }}
                                            >
                                                <label style={{ display: 'block', fontWeight: '700' }}>링크 검증</label>
                                            </button>
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                value={image.url}
                                                onChange={e => updateImage(image.id, 'url', e.target.value)}
                                                placeholder="예) https://media.istockphoto.com/id/590153468/ko"
                                                style={getInputStyle(
                                                    urlValidation.errors?.[`image_${image.id}_url`],
                                                    urlValidation[`image_${image.id}_url`]
                                                )}
                                            />
                                            {urlValidation[`image_${image.id}_url`] && (
                                                <div style={commonStyles.checkIcon.container}>
                                                    <CheckIcon />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '12px' }}>
                                        <label style={commonStyles.label.base}>클릭동작</label>
                                        <CustomSelect
                                            value={image.action}
                                            onChange={value => updateImage(image.id, 'action', value)}
                                            options={[
                                                { value: '', label: '없음' },
                                                { value: 'link', label: '링크' }
                                            ]}
                                            placeholder="없음"
                                        />
                                    </div>

                                    {image.action === 'link' && (
                                        <>
                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                    <label style={{ ...commonStyles.label.base, fontSize: '14px' }}>링크 URL</label>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleUrlCheck(image.linkUrl, (message) => showToast(message, e));
                                                            onUrlValidation(image.linkUrl, `image_${image.id}_linkUrl`);
                                                        }}
                                                        style={commonStyles.button.base}
                                                        onMouseEnter={(e) => {
                                                            Object.assign(e.target.style, commonStyles.button.hover);
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            Object.assign(e.target.style, commonStyles.button.base);
                                                        }}
                                                    >
                                                        <label style={{ display: 'block', fontWeight: '700' }}>링크 검증</label>
                                                    </button>
                                                </div>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type="text"
                                                        value={image.linkUrl}
                                                        onChange={e => updateImage(image.id, 'linkUrl', e.target.value)}
                                                        placeholder="예) https://www.example.com"
                                                        style={getInputStyle(
                                                            urlValidation.errors?.[`image_${image.id}_linkUrl`],
                                                            urlValidation[`image_${image.id}_linkUrl`]
                                                        )}
                                                    />
                                                    {urlValidation[`image_${image.id}_linkUrl`] && (
                                                        <div style={commonStyles.checkIcon.container}>
                                                            <CheckIcon />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ marginBottom: '0' }}>
                                                <label style={{ ...commonStyles.label.base, fontSize: '14px' }}>링크 열기</label>
                                                <RadioButton
                                                    options={[
                                                        { value: 'current', label: '현재창' },
                                                        { value: 'new', label: '새창' }
                                                    ]}
                                                    value={image.linkTarget}
                                                    onChange={value => updateImage(image.id, 'linkTarget', value)}
                                                    name={`linkTarget_${image.id}`}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}

                            {images.length < 5 && (
                                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={addImage}
                                        style={commonStyles.button.addButton}
                                        title="이미지 추가"
                                    >+</button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div style={{ marginBottom: '18px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label style={{ fontWeight: '500', margin: 0 }}>이미지 URL</label>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleUrlCheck(settings.imageUrl, (message) => showToast(message, e));
                                            onUrlValidation(settings.imageUrl, 'imageUrl');
                                        }}
                                        style={commonStyles.button.base}
                                        onMouseEnter={(e) => {
                                            Object.assign(e.target.style, commonStyles.button.hover);
                                        }}
                                        onMouseLeave={(e) => {
                                            Object.assign(e.target.style, commonStyles.button.base);
                                        }}
                                    >
                                        <label style={{ display: 'block', fontWeight: '700' }}>링크 검증</label>
                                    </button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={settings.imageUrl || ''}
                                        onChange={e => onInputChange('imageUrl', e.target.value)}
                                        placeholder="예) https://media.istockphoto.com/id/590153468/ko"
                                        style={{
                                            ...getInputStyle(
                                                validationErrors.imageUrl || urlValidation.errors?.imageUrl,
                                                urlValidation.imageUrl
                                            ),
                                            height: '44px',
                                            padding: '12px 16px',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    {urlValidation.imageUrl && (
                                        <div style={commonStyles.checkIcon.container}>
                                            <CheckIcon />
                                        </div>
                                    )}
                                </div>
                                {validationErrors.imageUrl && (
                                    <div style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                                        {validationErrors.imageUrl}
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>클릭동작</label>
                                <CustomSelect
                                    value={settings.clickAction || ''}
                                    onChange={value => onInputChange('clickAction', value)}
                                    options={[
                                        { value: '', label: '없음' },
                                        { value: 'link', label: '링크' }
                                    ]}
                                    placeholder="없음"
                                />
                            </div>

                            {settings.clickAction === 'link' && (
                                <>
                                    <div style={{ marginBottom: '18px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <label style={{ fontWeight: '500', margin: 0 }}>링크 URL</label>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleUrlCheck(settings.linkUrl, (message) => showToast(message, e));
                                                    onUrlValidation(settings.linkUrl, 'linkUrl');
                                                }}
                                                style={commonStyles.button.base}
                                                onMouseEnter={(e) => {
                                                    Object.assign(e.target.style, commonStyles.button.hover);
                                                }}
                                                onMouseLeave={(e) => {
                                                    Object.assign(e.target.style, commonStyles.button.base);
                                                }}
                                            >
                                                <label style={{ display: 'block', fontWeight: '700' }}>링크 검증</label>
                                            </button>
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                value={settings.linkUrl || ''}
                                                onChange={e => onInputChange('linkUrl', e.target.value)}
                                                placeholder="예) https://www.example.com"
                                                style={{
                                                    ...getInputStyle(
                                                        validationErrors.linkUrl || urlValidation.errors?.linkUrl,
                                                        urlValidation.linkUrl
                                                    ),
                                                    height: '44px',
                                                    padding: '12px 16px',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            {urlValidation.linkUrl && (
                                                <div style={commonStyles.checkIcon.container}>
                                                    <CheckIcon />
                                                </div>
                                            )}
                                        </div>
                                        {validationErrors.linkUrl && (
                                            <div style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                                                {validationErrors.linkUrl}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ marginBottom: '18px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>링크 열기</label>
                                        <RadioButton
                                            options={[
                                                { value: 'current', label: '현재창' },
                                                { value: 'new', label: '새창' }
                                            ]}
                                            value={settings.linkTarget || 'current'}
                                            onChange={value => onInputChange('linkTarget', value)}
                                            name="linkTarget"
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div style={getCardContentStyle(enabled)}>
                    이미지 입력이 비활성화되어 있습니다.
                </div>
            )}
        </div>
    );
};
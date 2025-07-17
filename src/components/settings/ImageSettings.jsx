import React, { useState, useEffect } from 'react';
import { ToggleBox, RadioButton, CustomSelect } from '../UIComponents';
import { handleUrlCheck } from '../../utils/ValidationUtils';

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
            // URL 에러 상태 지우기
            if (onInputChange) {
                onInputChange('clearUrlError', { field: `image_${imageId}_url` });
            }
        } else if (field === 'linkUrl') {
            onUrlValidation(value, `image_${imageId}_linkUrl`);
            // URL 에러 상태 지우기
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
                        fontSize: '18px',
                        fontWeight: 700,
                        color: enabled ? '#0e636e' : '#8ba7b3',
                        letterSpacing: '-0.5px',
                        transition: 'color .18s'
                    }}>
                        이미지 설정 {isSlideType && '(최대 5개)'}
                    </h4>
                    <p style={{
                        margin: '7px 0 0 0',
                        fontSize: '15px',
                        color: enabled ? '#4a4e56' : '#b0b8c2',
                        fontWeight: 400,
                        opacity: enabled ? 0.92 : 0.72,
                        transition: 'color .18s, opacity .18s'
                    }}>
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
                <div style={{ padding: '22px 18px 18px 18px', background: '#fff', borderRadius: '0 0 18px 18px' }}>
                    {isSlideType ? (
                        <>
                            {images.map((image, index) => (
                                <div key={image.id} style={{
                                    border: '1px solid #e5e7eb',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    marginBottom: '16px',
                                    background: '#f9fafb',
                                    position: 'relative'
                                }}>
                                    {images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeImage(image.id);
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
                                            title="이미지 삭제"
                                        >-</button>
                                    )}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '16px'
                                    }}>
                                        <h6 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#4a4e56' }}>
                                            이미지 {index + 1}
                                        </h6>
                                    </div>

                                    <div style={{ marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <label style={{ fontWeight: '500', margin: 0, fontSize: '14px' }}>이미지 URL</label>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleUrlCheck(image.url, (message) => showToast(message, e));
                                                    onUrlValidation(image.url, `image_${image.id}_url`);
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
                                                value={image.url}
                                                onChange={e => updateImage(image.id, 'url', e.target.value)}
                                                placeholder="예) https://media.istockphoto.com/id/590153468/ko"
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: `1px solid ${urlValidation.errors?.[`image_${image.id}_url`] ? '#dc2626' : '#d1d5db'}`,
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box',
                                                    paddingRight: urlValidation[`image_${image.id}_url`] ? '40px' : '12px',
                                                    background: urlValidation.errors?.[`image_${image.id}_url`] ? '#fef2f2' : 'white'
                                                }}
                                            />
                                            {urlValidation[`image_${image.id}_url`] && (
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

                                    <div style={{ marginBottom: '12px' }}>
                                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>클릭동작</label>
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
                                                    <label style={{ fontWeight: '500', margin: 0, fontSize: '14px' }}>링크 URL</label>
                                                    <button
                                                        onClick={(e) => {
                                                            handleUrlCheck(image.linkUrl, (message) => showToast(message, e));
                                                            onUrlValidation(image.linkUrl, `image_${image.id}_linkUrl`);
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
                                                        value={image.linkUrl}
                                                        onChange={e => updateImage(image.id, 'linkUrl', e.target.value)}
                                                        placeholder="예) https://www.example.com"
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px 12px',
                                                            border: `1px solid ${urlValidation.errors?.[`image_${image.id}_linkUrl`] ? '#dc2626' : '#d1d5db'}`,
                                                            borderRadius: '6px',
                                                            fontSize: '14px',
                                                            boxSizing: 'border-box',
                                                            paddingRight: urlValidation[`image_${image.id}_linkUrl`] ? '40px' : '12px',
                                                            background: urlValidation.errors?.[`image_${image.id}_linkUrl`] ? '#fef2f2' : 'white'
                                                        }}
                                                    />
                                                    {urlValidation[`image_${image.id}_linkUrl`] && (
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
                                            <div style={{ marginBottom: '0' }}>
                                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>링크 열기</label>
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
                                        style={{
                                            width: '34px',
                                            height: '34px',
                                            borderRadius: '50%',
                                            border: '1px solid #e5e7eb',
                                            background: '#f5f9fc',
                                            color: '#169DAF',
                                            fontSize: '22px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
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
                                        style={{
                                            padding: '4px 8px', background: 'rgb(249, 250, 251)', color: 'rgb(107, 114, 128)',
                                            border: '1px solid rgb(229, 231, 235)', borderRadius: '4px', fontSize: '12px', cursor: 'pointer',
                                            transition: 'all 0.2s ease', transform: 'translateY(0)'
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
                                        value={settings.imageUrl || ''}
                                        onChange={e => onInputChange('imageUrl', e.target.value)}
                                        placeholder="예) https://media.istockphoto.com/id/590153468/ko"
                                        style={{
                                            width: '100%',
                                            height: '44px',
                                            padding: '12px 16px',
                                            border: `1px solid ${validationErrors.imageUrl || urlValidation.errors?.imageUrl ? '#dc2626' : '#d1d5db'}`,
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            background: (validationErrors.imageUrl || urlValidation.errors?.imageUrl) ? '#fef2f2' : 'white',
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
                                                onClick={(e) => {
                                                    handleUrlCheck(settings.linkUrl, (message) => showToast(message, e));
                                                    onUrlValidation(settings.linkUrl, 'linkUrl');
                                                }}
                                                style={{
                                                    padding: '4px 8px', background: 'rgb(249, 250, 251)', color: 'rgb(107, 114, 128)',
                                                    border: '1px solid rgb(229, 231, 235)', borderRadius: '4px', fontSize: '12px', cursor: 'pointer',
                                                    transition: 'all 0.2s ease', transform: 'translateY(0)'
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
                                                value={settings.linkUrl || ''}
                                                onChange={e => onInputChange('linkUrl', e.target.value)}
                                                placeholder="예) https://www.example.com"
                                                style={{
                                                    width: '100%',
                                                    height: '44px',
                                                    padding: '12px 16px',
                                                    border: `1px solid ${validationErrors.linkUrl || urlValidation.errors?.linkUrl ? '#dc2626' : '#d1d5db'}`,
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    background: (validationErrors.linkUrl || urlValidation.errors?.linkUrl) ? '#fef2f2' : 'white',
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
                    이미지 입력이 비활성화되어 있습니다.
                </div>
            )}
        </div>
    );
};
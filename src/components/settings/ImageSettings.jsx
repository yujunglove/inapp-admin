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
                                  showToast
                              }) => {
    const enabled = !!settings.imageEnabled;
    const isSlideType = displayType?.toUpperCase() === 'SLIDE';
    
    // 슬라이드 타입에서 이미지 리스트 관리
    const [images, setImages] = useState([]);
    const [nextImageId, setNextImageId] = useState(1);

    // 기존 방식과의 호환성을 위한 초기화
    useEffect(() => {
        if (isSlideType && enabled && images.length === 0 && settings.imageUrl) {
            // 기존 단일 이미지 URL이 있으면 첫 번째 이미지로 변환
            setImages([{
                id: 1,
                url: settings.imageUrl,
                action: settings.clickAction || '',
                linkUrl: settings.linkUrl || '',
                linkTarget: settings.linkTarget || 'current'
            }]);
            setNextImageId(2);
        }
    }, [isSlideType, enabled, settings.imageUrl]);

    // 이미지 추가
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

    // 이미지 삭제
    const removeImage = (imageId) => {
        setImages(prev => prev.filter(img => img.id !== imageId));
    };

    // 이미지 업데이트
    const updateImage = (imageId, field, value) => {
        setImages(prev => prev.map(img => 
            img.id === imageId ? { ...img, [field]: value } : img
        ));

        // URL 필드 변경 시 자동 검증
        if (field === 'url') {
            onUrlValidation(value, `image_${imageId}_url`);
        } else if (field === 'linkUrl') {
            onUrlValidation(value, `image_${imageId}_linkUrl`);
        }
    };

    // 슬라이드 타입에서 이미지 데이터 변경 시 부모에게 전달
    useEffect(() => {
        if (isSlideType && enabled) {
            // 슬라이드용 이미지 배열을 부모에게 전달
            onInputChange('images', images);
        }
    }, [images, isSlideType, enabled]);

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
                <div style={{ padding: '32px 28px 28px 28px', background: '#fff', borderRadius: '0 0 18px 18px' }}>
                    {isSlideType ? (
                        // 슬라이드 타입: 여러 이미지 지원
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
                                    {/* - (삭제) 버튼 */}
                                    {images.length > 1 && (
                                        <button
                                            onClick={() => removeImage(image.id)}
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

                                    {/* 이미지 URL */}
                                    <div style={{ marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <label style={{ fontWeight: '500', margin: 0, fontSize: '14px' }}>이미지 URL</label>
                                            <button
                                                onClick={() => {
                                                    handleUrlCheck(image.url, showToast);
                                                    onUrlValidation(image.url, `image_${image.id}_url`);
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
                                                value={image.url}
                                                onChange={e => updateImage(image.id, 'url', e.target.value)}
                                                placeholder="예) https://media.istockphoto.com/id/590153468/ko"
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box',
                                                    paddingRight: urlValidation[`image_${image.id}_url`] ? '40px' : '12px'
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

                                    {/* 클릭동작 */}
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

                                    {/* 링크 설정 */}
                                    {image.action === 'link' && (
                                        <>
                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                    <label style={{ fontWeight: '500', margin: 0, fontSize: '14px' }}>링크 URL</label>
                                                    <button
                                                        onClick={() => {
                                                            handleUrlCheck(image.linkUrl, showToast);
                                                            onUrlValidation(image.linkUrl, `image_${image.id}_linkUrl`);
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
                                                        value={image.linkUrl}
                                                        onChange={e => updateImage(image.id, 'linkUrl', e.target.value)}
                                                        placeholder="예) https://www.example.com"
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px 12px',
                                                            border: '1px solid #d1d5db',
                                                            borderRadius: '6px',
                                                            fontSize: '14px',
                                                            boxSizing: 'border-box',
                                                            paddingRight: urlValidation[`image_${image.id}_linkUrl`] ? '40px' : '12px'
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

                            {/* 이미지 추가 버튼 */}
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
                        // 기존 타입: 단일 이미지
                        <>
                            {/* 이미지 URL */}
                            <div style={{ marginBottom: '18px' }}>
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
                                        value={settings.imageUrl || ''}
                                        onChange={e => onInputChange('imageUrl', e.target.value)}
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
                                {validationErrors.imageUrl && (
                                    <div style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                                        {validationErrors.imageUrl}
                                    </div>
                                )}
                            </div>

                            {/* 클릭동작 */}
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

                            {/* 링크 설정 */}
                            {settings.clickAction === 'link' && (
                                <>
                                    <div style={{ marginBottom: '18px' }}>
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
                                                value={settings.linkUrl || ''}
                                                onChange={e => onInputChange('linkUrl', e.target.value)}
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
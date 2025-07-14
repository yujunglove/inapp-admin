// components/settings/ImageSettings.jsx - 슬라이드형 이미지 추가 기능
import React, { useState } from 'react';

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
    // 슬라이드형일 때 다중 이미지 관리
    const [images, setImages] = useState([
        { id: 1, url: '', action: '', linkUrl: '', linkTarget: 'current' }
    ]);
    const [nextImageId, setNextImageId] = useState(2);

    const isSlideType = displayType?.toUpperCase() === 'SLIDE';
    const maxImages = isSlideType ? 5 : 1; // 슬라이드형은 최대 5개, 다른 타입은 1개

    // 이미지 추가 (슬라이드형만)
    const addImage = () => {
        if (images.length < maxImages) {
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

    // 이미지 삭제 (슬라이드형만, 최소 1개는 유지)
    const removeImage = (imageId) => {
        if (images.length > 1) {
            setImages(prev => prev.filter(img => img.id !== imageId));
        }
    };

    // 이미지 정보 업데이트
    const updateImage = (imageId, field, value) => {
        setImages(prev => prev.map(img =>
            img.id === imageId ? { ...img, [field]: value } : img
        ));

        // 첫 번째 이미지의 경우 기존 settings도 업데이트 (호환성)
        if (imageId === images[0]?.id) {
            if (field === 'url') {
                onInputChange('imageUrl', value);
            } else if (field === 'action') {
                onInputChange('clickAction', value);
            } else if (field === 'linkUrl') {
                onInputChange('linkUrl', value);
            } else if (field === 'linkTarget') {
                onInputChange('linkTarget', value);
            }
        }
    };

    const handleUrlChange = (imageId, url) => {
        updateImage(imageId, 'url', url);
        onUrlValidation(url, 'imageUrl');
    };

    const handleLinkUrlChange = (imageId, url) => {
        updateImage(imageId, 'linkUrl', url);
        onUrlValidation(url, 'linkUrl');
    };

    return (
        <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
            }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937'
                }}>
                    이미지 설정
                    {isSlideType && (
                        <span style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            fontWeight: '400',
                            marginLeft: '8px'
                        }}>
                            (최대 {maxImages}개)
                        </span>
                    )}
                </h3>

                {canToggle && (
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}>
                        <input
                            type="checkbox"
                            checked={settings.imageEnabled}
                            onChange={() => onToggle('imageEnabled')}
                            style={{
                                width: '20px',
                                height: '20px',
                                cursor: 'pointer'
                            }}
                        />
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                            이미지 사용
                        </span>
                    </label>
                )}
            </div>

            {settings.imageEnabled && (
                <div>
                    {/* 이미지 추가 버튼 (슬라이드형만) */}
                    {isSlideType && images.length < maxImages && (
                        <div style={{
                            marginBottom: '16px',
                            padding: '16px',
                            border: '2px dashed #d1d5db',
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <button
                                onClick={addImage}
                                style={{
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    margin: '0 auto'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12h14"/>
                                </svg>
                                이미지 추가 ({images.length}/{maxImages})
                            </button>
                        </div>
                    )}

                    {/* 이미지 목록 */}
                    {(isSlideType ? images : [images[0] || { id: 1, url: settings.imageUrl || '', action: settings.clickAction || '', linkUrl: settings.linkUrl || '', linkTarget: settings.linkTarget || 'current' }]).map((image, index) => (
                        <div
                            key={image.id}
                            style={{
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '20px',
                                marginBottom: '16px',
                                position: 'relative'
                            }}
                        >
                            {/* 삭제 버튼 (슬라이드형, 2개 이상일 때만) */}
                            {isSlideType && images.length > 1 && (
                                <button
                                    onClick={() => removeImage(image.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px'
                                    }}
                                    title="이미지 삭제"
                                >
                                    ×
                                </button>
                            )}

                            {isSlideType && (
                                <h4 style={{
                                    margin: '0 0 16px 0',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    color: '#374151'
                                }}>
                                    이미지 {index + 1}
                                </h4>
                            )}

                            {/* 이미지 URL */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151'
                                }}>
                                    이미지 URL *
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="url"
                                        value={image.url}
                                        onChange={(e) => handleUrlChange(image.id, e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        style={{
                                            width: '100%',
                                            padding: '10px 40px 10px 12px',
                                            border: validationErrors.imageUrl ? '2px solid #ef4444' : '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            outline: 'none',
                                            transition: 'border-color 0.2s ease'
                                        }}
                                    />
                                    {image.url && (
                                        <div style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }}>
                                            {urlValidation.imageUrl ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                                                    <path d="M20 6L9 17l-5-5"/>
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                                    <path d="M18 6L6 18M6 6l12 12"/>
                                                </svg>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {validationErrors.imageUrl && (
                                    <p style={{
                                        color: '#ef4444',
                                        fontSize: '12px',
                                        margin: '4px 0 0 0'
                                    }}>
                                        {validationErrors.imageUrl}
                                    </p>
                                )}
                            </div>

                            {/* 클릭 동작 */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151'
                                }}>
                                    클릭 동작
                                </label>
                                <select
                                    value={image.action}
                                    onChange={(e) => updateImage(image.id, 'action', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        background: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="">동작 없음</option>
                                    <option value="link">링크로 이동</option>
                                </select>
                            </div>

                            {/* 링크 URL (클릭 동작이 링크일 때만) */}
                            {image.action === 'link' && (
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '6px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#374151'
                                    }}>
                                        링크 URL *
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="url"
                                            value={image.linkUrl}
                                            onChange={(e) => handleLinkUrlChange(image.id, e.target.value)}
                                            placeholder="https://example.com"
                                            style={{
                                                width: '100%',
                                                padding: '10px 40px 10px 12px',
                                                border: validationErrors.linkUrl ? '2px solid #ef4444' : '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                transition: 'border-color 0.2s ease'
                                            }}
                                        />
                                        {image.linkUrl && (
                                            <div style={{
                                                position: 'absolute',
                                                right: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)'
                                            }}>
                                                {urlValidation.linkUrl ? (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                                                        <path d="M20 6L9 17l-5-5"/>
                                                    </svg>
                                                ) : (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                                        <path d="M18 6L6 18M6 6l12 12"/>
                                                    </svg>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {validationErrors.linkUrl && (
                                        <p style={{
                                            color: '#ef4444',
                                            fontSize: '12px',
                                            margin: '4px 0 0 0'
                                        }}>
                                            {validationErrors.linkUrl}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* 링크 타겟 (클릭 동작이 링크일 때만) */}
                            {image.action === 'link' && (
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '6px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#374151'
                                    }}>
                                        링크 열기 방식
                                    </label>
                                    <select
                                        value={image.linkTarget}
                                        onChange={(e) => updateImage(image.id, 'linkTarget', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            outline: 'none',
                                            background: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="current">현재 창에서 열기</option>
                                        <option value="new">새 창에서 열기</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    ))}

                    {isSlideType && images.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: '#6b7280',
                            fontSize: '14px'
                        }}>
                            이미지를 추가해주세요.
                        </div>
                    )}
                </div>
            )}

            {!settings.imageEnabled && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#6b7280',
                    fontSize: '14px'
                }}>
                    이미지를 사용하려면 위의 토글을 활성화해주세요.
                </div>
            )}
        </div>
    );
};
import React, { useEffect, useRef, useState } from 'react';
import {
    ModuleWrapper, ContentSection, Header, HeaderIcon, StepTitle, StepNumber,
    ContentArea, NavigationArea, BackButton, NextButton, PreviewSection} from './styles/StyledComponents';
import {BackIcon, NextIcon, DisplayIcon, ImageIcon} from './components/Icons';
import SelectionGridComponent from './components/SelectionGrid';
import { UnifiedSettings } from './components/UnifiedSettings';
import { useInAppData, useInAppSelections } from './hooks/useInAppData';
import {getCurrentItems, getCurrentStepTitle, getCurrentStepNumber, isNextEnabled,} from './utils/inAppUtils';
import { InAppService } from './services/inAppService';
import { createDefaultPreviewData } from './config/dbMapping';
import { generatePopupHTML } from './components/popupGenerator';
import Draggable from 'react-draggable';

const THEME_MAPPING = {
    BAR: {
        'images': { theme: 'T1', code: 'M1', cssClass: 'qdx_theme1-1' },
        'msg': { theme: 'T2', code: 'M2', cssClass: 'qdx_theme1-2' },
        'images,msg': { theme: 'T3', code: 'M3', cssClass: 'qdx_theme1-3' }
    },
    BOX: {
        'images': { theme: 'T4', code: 'M1', cssClass: 'qdx_theme2-1' },
        'images,buttons': { theme: 'T5', code: 'M4', cssClass: 'qdx_theme2-2' },
        'images,buttons2': { theme: 'T6', code: 'M5', cssClass: 'qdx_theme2-3' },
        'images,msg': { theme: 'T7', code: 'M3', cssClass: 'qdx_theme2-4' },
        'images,msg,buttons': { theme: 'T8', code: 'M6', cssClass: 'qdx_theme2-5' },
        'images,msg,buttons2': { theme: 'T9', code: 'M7', cssClass: 'qdx_theme2-6' }
    },
    SLIDE: {
        'images': { theme: 'T10', code: 'M1', cssClass: 'qdx_theme3-1' },
        'images,buttons': { theme: 'T11', code: 'M4', cssClass: 'qdx_theme3-2' },
        'images,buttons2': { theme: 'T12', code: 'M5', cssClass: 'qdx_theme3-3' },
        'images,msg': { theme: 'T13', code: 'M3', cssClass: 'qdx_theme3-4' },
        'images,msg,buttons': { theme: 'T14', code: 'M6', cssClass: 'qdx_theme3-5' },
        'images,msg,buttons2': { theme: 'T15', code: 'M7', cssClass: 'qdx_theme3-6' }
    },
    STAR: {
        'msg': { theme: 'T16', code: 'M8', cssClass: 'qdx_theme4-1' }
    }
};

const InAppModule = ({
    config = {},
    onDataChange = () => {},
    onError = () => {},
    onLoad = () => {},
    initialData = null
}) => {
    const settingsRef = useRef();
    const previewIframeRef = useRef();

    const [previewData, setPreviewData] = useState(null);
    const [isValidForSave, setIsValidForSave] = useState(false);
    const [showTodayModal, setShowTodayModal] = useState(false);
    const [showJsonModal, setShowJsonModal] = useState(false);
    const [showLocationMenu, setShowLocationMenu] = useState(false);

    const { displayTypes, locations, loading, error } = useInAppData(config);
    const {
        currentStep,
        selections,
        handleItemSelect,
        handleNext,
        handleBack,
        setInitialData,
        preservedSettings,
        setPreservedSettings
    } = useInAppSelections(onDataChange, loading);

    useEffect(() => {
        setInitialData(initialData);
    }, [initialData, loading]);

    // 테마 계산 함수
    const calculateTheme = (displayType, settings, buttons) => {
        const showComponents = [];

        if (settings.imageEnabled || (settings.images && settings.images.length > 0) || settings.imageUrl) {
            showComponents.push('images');
        }

        if (settings.textEnabled || settings.titleContent || settings.bodyContent || 
            (settings.msg && (settings.msg.title || settings.msg.text))) {
            showComponents.push('msg');
        }

        const hasButtons = settings.buttonEnabled || (buttons && buttons.length > 0) || 
                          (settings.buttons && settings.buttons.length > 0);
        
        if (hasButtons) {
            const buttonCount = buttons?.length || settings.buttons?.length || 1;
            showComponents.push(buttonCount >= 2 ? 'buttons2' : 'buttons');
        }

        const showKey = showComponents.join(',');
        const themeInfo = THEME_MAPPING[displayType?.toUpperCase()]?.[showKey];

        return {
            theme: themeInfo?.theme || (displayType?.toUpperCase() === 'BOX' ? 'T4' : 'T1'),
            code: themeInfo?.code || 'M1',
            cssClass: themeInfo?.cssClass || (displayType?.toUpperCase() === 'BOX' ? 'qdx_theme2-1' : 'qdx_theme1-1'),
            show: showComponents
        };
    };

    useEffect(() => {
        if (!selections.displayType && !previewData) {
            setPreviewData(createDefaultPreviewData("BAR"));
        }
    }, [selections.displayType, previewData]);

    // 미리보기 데이터 처리
    useEffect(() => {
        if (currentStep === 1 && selections.displayType) {
            const userBasedData = {
                display: selections.displayType.toLowerCase(),
                template: 'M3',
                code: 'M3',
                location: 'TOP',
                today: previewData?.today || 'N',
                show: [],
                images: [],
                msg: {},
                buttons: []
            };

            if (preservedSettings && (preservedSettings.titleContent || preservedSettings.bodyContent || 
                preservedSettings.imageUrl || preservedSettings.images || 
                (preservedSettings.buttons && preservedSettings.buttons.length > 0))) {
                
                // 이미지 설정
                if (preservedSettings.imageEnabled) {
                    if (selections.displayType.toUpperCase() === 'SLIDE' && preservedSettings.images) {
                        userBasedData.images = preservedSettings.images;
                    } else if (preservedSettings.imageUrl) {
                        userBasedData.images = [{
                            seq: 1,
                            url: preservedSettings.imageUrl,
                            action: preservedSettings.clickAction === 'link' ? 'L' : '',
                            linkUrl: preservedSettings.linkUrl || '',
                            linkOpt: preservedSettings.linkTarget === 'new' ? 'B' : 'S'
                        }];
                    } else {
                        userBasedData.images = [{
                            seq: 1,
                            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhFjJgDxmK9CVk3XxTiitDyZLIOKJvtZNLrg&s",
                            action: "",
                            linkUrl: "",
                            linkOpt: ""
                        }];
                    }
                    userBasedData.show.push('images');
                } else {
                    userBasedData.images = [{
                        seq: 1,
                        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhFjJgDxmK9CVk3XxTiitDyZLIOKJvtZNLrg&s",
                        action: "",
                        linkUrl: "",
                        linkOpt: ""
                    }];
                    userBasedData.show.push('images');
                }

                // 텍스트 설정
                if (preservedSettings.textEnabled) {
                    userBasedData.msg = {
                        title: preservedSettings.titleContent || '',
                        text: preservedSettings.bodyContent || ''
                    };
                    if (!preservedSettings.titleContent && !preservedSettings.bodyContent) {
                        userBasedData.msg = {
                            title: `${selections.displayType?.toUpperCase()}형 미리보기`,
                            text: "이것은 미리보기 내용입니다."
                        };
                    }
                    userBasedData.show.push('msg');
                } else {
                    userBasedData.msg = {
                        title: `${selections.displayType?.toUpperCase()}형 미리보기`,
                        text: "이것은 미리보기 내용입니다."
                    };
                    userBasedData.show.push('msg');
                }

                // 버튼 설정
                if (preservedSettings.buttonEnabled) {
                    if (preservedSettings.buttons && preservedSettings.buttons.length > 0) {
                        userBasedData.buttons = preservedSettings.buttons.map((btn, index) => ({
                            seq: index + 1,
                            text: btn.text || '',
                            linkUrl: btn.url || '',
                            linkOpt: btn.target === 'new' ? 'B' : 'S'
                        }));
                        userBasedData.show.push(preservedSettings.buttons.length >= 2 ? 'buttons2' : 'buttons');
                    } else {
                        userBasedData.buttons = [{
                            seq: 1,
                            text: "버튼 예시",
                            linkUrl: "https://www.example.com",
                            linkOpt: "S"
                        }];
                        userBasedData.show.push('buttons');
                    }
                }

                setPreviewData(userBasedData);
            } else {
                setPreviewData(createDefaultPreviewData(selections.displayType));
            }
        } else if (currentStep === 2 && selections.displayType && !previewData) {
            setPreviewData(createDefaultPreviewData(selections.displayType));
        } else if (currentStep === 1 && !selections.displayType) {
            setPreviewData(createDefaultPreviewData('BAR'));
        }
    }, [selections.displayType, currentStep, preservedSettings]);

    // 미리보기 데이터 변경 처리
    useEffect(() => {
        if (previewData && previewIframeRef.current?.contentWindow) {
            previewIframeRef.current.contentWindow.postMessage({
                type: 'show_preview',
                data: previewData
            }, '*');
        }
    }, [previewData]);

    const handleIframeLoad = () => {
        previewIframeRef.current.contentWindow.postMessage({
            type: 'show_preview',
            data: previewData
        })
    };

    // iframe 메시지 처리
    useEffect(() => {
        const handleMessage = (e) => {
            if (e.data.type === 'generate_popup_html') {
                const html = generatePopupHTML(e.data.messageId, e.data.data);
                previewIframeRef.current.contentWindow.postMessage({
                    type: 'popup_html_generated',
                    html: html
                }, '*');
            } else if (e.data.type === 'today_option_changed') {
                setPreviewData(prev => ({
                    ...prev,
                    today: e.data.checked ? 'Y' : 'N'
                }));
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const getHeaderIcon = () => {
        return currentStep === 1 ? <DisplayIcon /> : <ImageIcon />;
    };

    // 설정 데이터 변경 처리
    const handleSettingsDataChange = (jsonData) => {
        const settings = {
            imageEnabled: jsonData.images && jsonData.images.length > 0,
            imageUrl: jsonData.images?.[0]?.url,
            images: jsonData.images,
            textEnabled: jsonData.msg && (jsonData.msg.title || jsonData.msg.text),
            titleContent: jsonData.msg?.title,
            bodyContent: jsonData.msg?.text,
            buttonEnabled: jsonData.buttons && jsonData.buttons.length > 0,
            location: jsonData.location || 'TOP'
        };

        const buttons = jsonData.buttons || [];
        const themeInfo = calculateTheme(selections.displayType, settings, buttons);
        const basePreviewData = previewData || createDefaultPreviewData(selections.displayType);

        const validatedData = {
            ...basePreviewData,
            ...jsonData,
            display: selections.displayType || 'BOX',
            code: themeInfo.code,
            cssClass: themeInfo.cssClass,
            show: themeInfo.show,
            msg: {
                title: jsonData.msg?.title || "",
                text: jsonData.msg?.text || ""
            },
            buttons: jsonData.buttons?.map(btn => ({
                ...btn,
                text: btn.text || "",
                linkUrl: btn.linkUrl || "",
                linkOpt: btn.linkOpt || ""
            })) || [],
            images: jsonData.images?.map(img => ({
                ...img,
                url: img.url || "",
                action: img.action || "",
                linkUrl: img.linkUrl || "",
                linkOpt: img.linkOpt || ""
            })) || []
        };

        setPreviewData(validatedData);
    };

    const handleValidationChange = (isValid) => {
        setIsValidForSave(isValid);
    };

    // JSON 형식 변환
    const convertToNewJsonFormat = (originalData) => {
        const settings = settingsRef.current?.getSettingsData?.() || {};
        const buttons = settingsRef.current?.getButtonsData?.() || [];
        const themeInfo = calculateTheme(selections.displayType, settings, buttons);

        const newFormat = {
            display: selections.displayType || 'BOX',
            theme: themeInfo.theme,
            show: themeInfo.show,
            location: settings.location || 'TOP',
            images: [],
            msg: {},
            today: originalData?.today || 'N',
            buttons: []
        };

        // 이미지 데이터 변환
        if (settings.imageEnabled) {
            if (selections.displayType?.toUpperCase() === 'SLIDE' && settings.images && Array.isArray(settings.images)) {
                newFormat.images = settings.images
                    .filter(img => img.url && img.url.trim())
                    .map((img, index) => ({
                        seq: index + 1,
                        url: img.url,
                        action: img.action === 'link' ? 'L' : '',
                        linkUrl: img.action === 'link' ? (img.linkUrl || '') : '',
                        linkOpt: img.linkTarget === 'new' ? 'B' : 'S'
                    }));
            } else if (settings.imageUrl) {
                newFormat.images.push({
                    seq: 1,
                    url: settings.imageUrl,
                    action: settings.clickAction === 'link' ? 'L' : 'N',
                    linkUrl: settings.linkUrl || '',
                    linkOpt: settings.linkTarget === 'new' ? 'B' : 'S'
                });
            }
        }

        // 메시지 데이터 변환
        if (settings.textEnabled) {
            newFormat.msg = {
                title: settings.titleContent || '',
                text: settings.bodyContent || ''
            };
        }

        // 버튼 데이터 변환
        if (settings.buttonEnabled && buttons.length > 0) {
            newFormat.buttons = buttons.map((btn, index) => ({
                seq: index + 1,
                text: btn.text || '',
                linkUrl: btn.url || '',
                linkOpt: btn.target === 'new' ? 'B' : 'S'
            }));
        }

        return newFormat;
    };

    // 위치 변경 처리
    const handleLocationChange = (newLocation) => {
        setPreviewData(prev => ({
            ...prev,
            location: newLocation
        }));
        setShowLocationMenu(false);
    };

    // 외부 클릭 시 위치 메뉴 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showLocationMenu && !event.target.closest('[data-location-menu]')) {
                setShowLocationMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showLocationMenu]);

    // JSON 복사 처리
    const handleCopyJson = () => {
        const jsonForCopy = (currentStep === 2 && settingsRef.current) 
            ? convertToNewJsonFormat(previewData) 
            : previewData;
        
        const jsonString = JSON.stringify(jsonForCopy, null, 2);
        navigator.clipboard.writeText(jsonString).then(() => {
            alert('JSON이 클립보드에 복사되었습니다!');
            setShowJsonModal(false);
        });
    };

    // 제출/저장 처리
    const handleSubmit = () => {
        if (currentStep === 2) {
            if (settingsRef.current?.validateSettings()) {
                const jsonData = settingsRef.current?.getJsonData();
                console.log('전송 데이터:', jsonData);

                InAppService.showTestMessage(jsonData).then(success => {
                    if (success) {
                        alert('인앱 메시지가 전체 화면에 표시되었습니다!');
                    }
                });
            } else {
                alert('입력되지 않은 필드가 있습니다. 빨간색으로 표시된 필드를 확인해주세요.');
            }
        } else {
            handleNext();
        }
    };
    
    // 뒤로 가기 처리 (설정 보존)
    const handleBackWithPreservation = () => {
        if (currentStep === 2 && settingsRef.current) {
            const currentSettings = settingsRef.current.getSettingsData?.();
            const currentButtons = settingsRef.current.getButtonsData?.();
            
            const preservedData = {
                titleContent: currentSettings?.titleContent || '',
                bodyContent: currentSettings?.bodyContent || '',
                imageUrl: currentSettings?.imageUrl || '',
                linkUrl: currentSettings?.linkUrl || '',
                clickAction: currentSettings?.clickAction || '',
                linkTarget: currentSettings?.linkTarget || 'current',
                textEnabled: currentSettings?.textEnabled || false,
                imageEnabled: currentSettings?.imageEnabled || false,
                buttonEnabled: currentSettings?.buttonEnabled || false,
                buttons: currentButtons || []
            };

            if (selections.displayType === 'SLIDE' || selections.displayType === 'slide') {
                if (currentSettings?.images && Array.isArray(currentSettings.images)) {
                    preservedData.images = currentSettings.images;
                } else if (previewData?.images && Array.isArray(previewData.images)) {
                    preservedData.images = previewData.images.map((img, index) => ({
                        id: index + 1,
                        url: img.url || '',
                        action: img.action === 'L' ? 'link' : '',
                        linkUrl: img.linkUrl || '',
                        linkTarget: img.linkOpt === 'B' ? 'new' : 'current'
                    }));
                }
            }

            setPreservedSettings(preservedData);
        }
        
        handleBack();
    };

    // 미리보기 버튼 렌더링
    const renderPreviewButtons = () => {
        if (currentStep !== 1 && currentStep !== 2) return null;

        // react-draggable 라이브러리 사용
        return (
            <Draggable
                handle=".drag-handle"
                defaultPosition={{x: 0, y: 20}}
                bounds="parent"
            >
                <div 
                    className="draggable-control-panel"
                    style={{
                        position: 'absolute',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        zIndex: 100,
                        background: 'white',
                        padding: '16px',
                        paddingTop: '24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: '1px solid #e5e7eb',
                        userSelect: 'none',
                        transition: 'box-shadow 0.2s ease',
                        width: '160px',
                        right: '20px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                >
                    {/* 드래그 핸들 - 이 부분만 드래그 가능 */}
                    <div 
                        className="drag-handle"
                        style={{
                            position: 'absolute',
                            top: '6px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '40px',
                            height: '4px',
                            background: '#d1d5db',
                            borderRadius: '2px',
                            cursor: 'grab'
                        }}
                    />
                    
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        color: '#374151',
                        marginTop: '8px'
                    }}>
                        <input
                            type="checkbox"
                            checked={previewData?.today === 'Y'}
                            onChange={(e) => {
                                setPreviewData(prev => ({
                                    ...prev,
                                    today: e.target.checked ? 'Y' : 'N'
                                }));
                            }}
                            style={{
                                width: '14px',
                                height: '14px',
                                cursor: 'pointer'
                            }}
                        />
                        오늘하루 안보기
                    </label>
                    
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowJsonModal(true);
                        }}
                        style={{
                            padding: '8px 16px',
                            background: '#fcad27',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.2s ease',
                            transform: 'translateY(0)',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#e09820';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(252, 173, 39, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#fcad27';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        JSON 보기
                    </button>
                    
                    <div style={{ position: 'relative' }} data-location-menu>
                        <button
                            type="button"
                            title="위치 설정"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowLocationMenu(!showLocationMenu);
                            }}
                            style={{
                                padding: '8px 16px',
                                background: '#169DAF',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transition: 'all 0.2s ease',
                                transform: 'translateY(0)',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = '#127a8a';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(22, 157, 175, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = '#169DAF';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                             {previewData?.location || 'TOP'}
                        </button>
                        
                        {showLocationMenu && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: '0',
                                right: '0',
                                marginTop: '4px',
                                background: 'white',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                overflow: 'hidden',
                                zIndex: 1000
                            }}>
                                {['TOP', 'MID', 'BOT'].map(location => (
                                    <button
                                        type="button"
                                        key={location}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLocationChange(location);
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            background: previewData?.location === location ? '#3b82f6' : 'transparent',
                                            color: previewData?.location === location ? 'white' : '#374151',
                                            border: 'none',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.15s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (previewData?.location !== location) {
                                                e.target.style.background = '#f3f4f6';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (previewData?.location !== location) {
                                                e.target.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        {location === 'TOP' ? '상단 (TOP)' : location === 'MID' ? '중앙 (MID)' : '하단 (BOT)'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Draggable>
        );
    };

    // 메인 콘텐츠 렌더링
    const renderContent = () => {
        if (currentStep === 2 && selections.displayType) {
            return (
                <UnifiedSettings
                    ref={settingsRef}
                    displayType={selections.displayType}
                    onDataChange={handleSettingsDataChange}
                    onValidationChange={handleValidationChange}
                    preservedSettings={preservedSettings}
                    onSettingsPreserve={setPreservedSettings}
                />
            );
        }

        if (currentStep === 1) {
            const items = getCurrentItems(currentStep, displayTypes, locations, selections);
            return (
                <SelectionGridComponent
                    items={items}
                    currentStep={currentStep}
                    selections={selections}
                    onItemSelect={handleItemSelect}
                />
            );
        }

        return null;
    };

    // 로딩 상태
    if (loading) {
        return (
            <div className="qdx_adm_wrap">
                <ModuleWrapper>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        gap: '20px'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            justifyContent: 'center',
                            border: '4px solid #e5e7eb',
                            borderTop: '4px solid #3b82f6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <p style={{ color: '#6b7280', fontSize: '16px' }}>데이터를 불러오는 중...</p>
                        <style>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                </ModuleWrapper>
            </div>
        );
    }

    // 메인 렌더링
    return (
        <div className="qdx_adm_wrap">
            <ModuleWrapper>
                <ContentSection>
                    <Header>
                        <HeaderIcon>
                            {getHeaderIcon()}
                        </HeaderIcon>
                        <div style={{ flex: 1 }}>
                            <StepTitle>
                                {getCurrentStepTitle(currentStep)}
                            </StepTitle>
                            {currentStep === 2 && (
                                <p style={{
                                    color: '#6b7280',
                                    fontSize: '14px',
                                    margin: '4px 0 0 0',
                                    fontWeight: '400'
                                }}>
                                    필요한 구성 요소를 선택하고 설정하세요.
                                </p>
                            )}
                        </div>
                        <StepNumber>
                            {getCurrentStepNumber(currentStep)}
                        </StepNumber>
                    </Header>

                    <ContentArea style={{
                        maxHeight: 'calc(100vh - 140px)',
                        overflowY: 'auto',
                        overflowX: 'hidden'
                    }}>
                        {renderContent()}
                    </ContentArea>

                    <NavigationArea>
                        <BackButton onClick={handleBackWithPreservation} disabled={currentStep === 1}>
                            <BackIcon />
                        </BackButton>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <NextButton
                                onClick={handleSubmit}
                                disabled={currentStep === 1 ? !isNextEnabled(currentStep, selections) : (currentStep === 2 && !isValidForSave)}
                            >
                                {currentStep === 2 ? (
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M20 6L9 17l-5-5"/>
                                    </svg>
                                ) : (
                                    <NextIcon />
                                )}
                            </NextButton>
                        </div>
                    </NavigationArea>
                </ContentSection>

                <PreviewSection>
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        {renderPreviewButtons()}
                        
                        <iframe
                            ref={previewIframeRef}
                            onLoad={handleIframeLoad}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                background: 'transparent',
                                minHeight: '400px'
                            }}
                            srcDoc={`
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>QDX Preview</title>
    <link rel="stylesheet" href="https://quadmax.co.kr/qdx/css/qdx_popup.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&family=Nanum+Myeongjo:wght@400;700;800&family=Nanum+Pen+Script&family=Nanum+Brush+Script&display=swap" rel="stylesheet">
    <style>
        /* 기본 CSS 오버라이드 - Pretendard 폰트 강제 적용 해제 */
        #qdx_popup_wrap * {
            font-family: inherit !important;
        }
        
        /* 텍스트 요소의 폰트 스타일 강제 적용 */
        .qdx_text h2 *, .qdx_text p *, .qdx_text .qdx_text_content *, 
        .qdx_text h2, .qdx_text p, .qdx_text .qdx_text_content {
            font-family: inherit !important;
        }
        
        /* 특정 폰트 클래스 강제 적용 */
        [style*="Nanum Gothic"] *, [style*="Nanum Gothic"] {
            font-family: 'Nanum Gothic', sans-serif !important;
        }
        
        [style*="Nanum Myeongjo"] *, [style*="Nanum Myeongjo"] {
            font-family: 'Nanum Myeongjo', serif !important;
        }
        
        [style*="Nanum Pen Script"] *, [style*="Nanum Pen Script"] {
            font-family: 'Nanum Pen Script', cursive !important;
        }
        
        [style*="Nanum Brush Script"] *, [style*="Nanum Brush Script"] {
            font-family: 'Nanum Brush Script', cursive !important;
        }
        
        /* 모든 텍스트 요소에 사용자 설정 폰트 적용 */
        .qdx_text span[style*="font-family"] {
            font-family: inherit !important;
        }
        
        /* 기본 폰트 설정 */
        .qdx_text {
            font-family: 'Nanum Gothic', sans-serif !important;
        }
        
        /* 동적으로 적용되는 폰트 스타일 우선순위 보장 */
        .qdx_text [style] {
            font-family: inherit !important;
        }
    </style>
</head>
<body>
    <script>
        let localQdx = null;
        let qdxReady = false;
        let pendingPreview = null;
        
        function initLocalQdx() {
            // QdxRenderer를 인라인으로 정의
            window.QdxRenderer = {
                showMsg: (id, data) => {
                    window.parent.postMessage({
                        type: 'generate_popup_html',
                        messageId: id,
                        data: data
                    }, '*');
                }
            };
            
            localQdx = window.QdxRenderer;
            qdxReady = true;
            
            if (pendingPreview) {
                showPreview(pendingPreview);
                pendingPreview = null;
            }
        }
        
        function initSwiper(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            if (!window.Swiper) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
                script.onload = () => {
                    const css = document.createElement('link');
                    css.rel = 'stylesheet';
                    css.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
                    document.head.appendChild(css);
                    
                    setTimeout(() => {
                        createSwiper(containerId);
                    }, 100);
                };
                document.head.appendChild(script);
            } else {
                createSwiper(containerId);
            }
        }

        function createSwiper(containerId) {
            const swiper = new window.Swiper(\`#\${containerId}\`, {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: false,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                navigation: {
                    nextEl: \`#\${containerId} .swiper-button-next\`,
                    prevEl: \`#\${containerId} .swiper-button-prev\`,
                },
                pagination: {
                    el: \`#\${containerId} .swiper-pagination\`,
                    type: 'custom',
                    renderCustom: function (swiper, current, total) {
                        return \`<span class="swiper-pagination-current">\${current}</span> / <span class="swiper-pagination-total">\${total}</span>\`;
                    }
                }
            });
            
            return swiper;
        }
        
        function showPreview(data) {
            if (!qdxReady || !localQdx) {
                pendingPreview = data;
                return;
            }
            localQdx.showMsg('TEST_' + Date.now(), data);
        }
        
        window.addEventListener('message', (e) => {
            if (e.data.type === 'show_preview') {
                showPreview(e.data.data);
            } else if (e.data.type === 'popup_html_generated') {
                document.getElementById('qdx_popup_wrap')?.remove();
                document.body.insertAdjacentHTML('beforeend', e.data.html);
                adjustPreviewPosition();
                
                setTimeout(() => {
                    const popup = document.getElementById('qdx_popup_wrap');
                    if (popup) {
                        applyFontStyles(popup);
                        
                        // zoom 재적용 (텍스트 토글 시에도 유지)
                        const popupBox = popup.querySelector('.qdx_popup_box');
                        if (popupBox) {
                            popupBox.style.zoom = '0.9';
                        }
                        
                        const slideElement = popup.querySelector('#qdx_slide');
                        if (slideElement) {
                            setTimeout(() => {
                                initSwiper('qdx_slide');
                            }, 200);
                        }
                    }
                }, 100);
                
                const todayCheckbox = document.querySelector('input[name="today"]');
                if (todayCheckbox) {
                    todayCheckbox.addEventListener('change', (event) => {
                        window.parent.postMessage({
                            type: 'today_option_changed',
                            checked: event.target.checked
                        }, '*');
                    });
                }
            }
        });
        
        function adjustPreviewPosition() {
            const popup = document.getElementById('qdx_popup_wrap');
            if (!popup) return;
            
            popup.style.background = '#fafafa';
            applyFontStyles(popup);
            
            // 전체 팝업 박스에 고정 zoom 적용
            const popupBox = popup.querySelector('.qdx_popup_box');
            if (popupBox) {
               popupBox.style.zoom = '0.9';  // 0.9로 조정
            }
            
            const contElement = popup.querySelector('.qdx_cont');
            if (contElement) {
                contElement.style.boxShadow = 'rgba(0, 0, 0, 0.2) 8px 8px 24px 8px';
                contElement.style.transform = 'none';
            }
        }
        
        function applyFontStyles(container) {
            const textContainers = container.querySelectorAll('.qdx_text');
            
            textContainers.forEach((textContainer) => {
                const allElements = textContainer.querySelectorAll('*');
                allElements.forEach((element) => {
                    const style = element.getAttribute('style');
                    if (style) {
                        const styleDeclarations = style.split(';').filter(decl => decl.trim());
                        styleDeclarations.forEach(declaration => {
                            const [property, value] = declaration.split(':').map(s => s.trim());
                            if (property && value) {
                                // 폰트 패밀리는 특히 강제로 적용
                                if (property === 'font-family') {
                                    element.style.setProperty(property, value, 'important');
                                } else {
                                    element.style.setProperty(property, value, 'important');
                                }
                            }
                        });
                    }
                });
            });
        }
        
        function selectStar(score) {
            document.querySelectorAll('.qdx_startImg').forEach(star => {
                star.classList.remove('qdx_on');
            });
            
            for (let i = 1; i <= score; i++) {
                const star = document.querySelector(\`.qdx_startImg[data-score="\${i}"]\`);
                if (star) {
                    star.classList.add('qdx_on');
                }
            }
        }
        
        window.selectStar = selectStar;
        
        // 버튼 클릭 핸들러 추가
        window.handleButtonClick = function(event, url, target) {
            // 빈 URL이나 # 만 있는 경우 기본 동작 방지
            if (!url || url === '#' || url.startsWith('#')) {
                event.preventDefault();
                console.log('Empty or hash-only URL, preventing navigation');
                return false;
            }
            
            // 정상적인 URL인 경우
            if (url.startsWith('http://') || url.startsWith('https://')) {
                // target에 따라 처리
                if (target === '_blank') {
                    window.open(url, '_blank');
                } else {
                    window.location.href = url;
                }
                event.preventDefault();
                return false;
            }
            
            // 상대 경로인 경우 기본 동작 방지
            event.preventDefault();
            console.log('Relative URL detected, preventing navigation:', url);
            return false;
        };
        
        // 이미지 클릭 핸들러 추가
        window.handleImageClick = function(event, url, target) {
            // 버튼 클릭과 동일한 로직 적용
            return window.handleButtonClick(event, url, target);
        };
        
        initLocalQdx();
    </script>
</body>
</html>
                            `}
                            title="QDX Preview"
                            sandbox="allow-scripts allow-same-origin allow-popups"
                        />
                    </div>
                </PreviewSection>
            </ModuleWrapper>

            {/* JSON 모달 */}
            {showJsonModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '8px',
                        padding: '24px',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                                JSON 데이터
                            </h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleCopyJson();
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                                    </svg>
                                    복사
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowJsonModal(false);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                        color: '#6b7280'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <pre style={{
                            background: '#f8f9fa',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            padding: '16px',
                            fontSize: '12px',
                            fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            color: '#1f2937',
                            overflow: 'auto',
                            lineHeight: '1.5',
                            margin: 0,
                            whiteSpace: 'pre-wrap',
                            maxHeight: '400px'
                        }}>
                            {(() => {
                                const jsonToShow = (currentStep === 2 && settingsRef.current) 
                                    ? convertToNewJsonFormat(previewData) 
                                    : previewData;
                                
                                return jsonToShow ? JSON.stringify(jsonToShow, null, 2) : '데이터가 없습니다.';
                            })()}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InAppModule;
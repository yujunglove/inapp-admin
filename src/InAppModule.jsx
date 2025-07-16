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
import { getDisplayConfig } from './config/displayTypeConfig';

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
                         initialData = null
                     }) => {
    const settingsRef = useRef();
    const previewIframeRef = useRef();

    // 프리뷰 데이터와 검증 상태
    const [previewData, setPreviewData] = useState(null);
    const [isValidForSave, setIsValidForSave] = useState(false);

    // 팝업 상태들
    const [showTodayModal, setShowTodayModal] = useState(false);
    const [showJsonModal, setShowJsonModal] = useState(false);
    const [showLocationMenu, setShowLocationMenu] = useState(false);

    // 커스텀 훅 사용 (2단계 구조)
    const { displayTypes, locations, loading, error } = useInAppData(config);

    const {
        currentStep,
        selections,
        handleItemSelect,
        handleNext,
        handleBack,
        setInitialData,
        preservedSettings, // 보존된 설정 데이터
        setPreservedSettings // 설정 보존 함수
    } = useInAppSelections(onDataChange, loading);

    useEffect(() => {
        setInitialData(initialData);
    }, [initialData, loading]);

    // Theme 자동 계산 함수 - 버튼 타입 구분 추가
    const calculateTheme = (displayType, settings, buttons) => {
        const showComponents = [];

        // 이미지 확인 - 실제 데이터와 활성화 상태 모두 확인
        if (settings.imageEnabled || (settings.images && settings.images.length > 0) || settings.imageUrl) {
            showComponents.push('images');
        }

        // 텍스트 확인 - 실제 데이터와 활성화 상태 모두 확인
        if (settings.textEnabled || settings.titleContent || settings.bodyContent || 
            (settings.msg && (settings.msg.title || settings.msg.text))) {
            showComponents.push('msg');
        }

        // 버튼 확인 - 실제 데이터와 활성화 상태 모두 확인
        const hasButtons = settings.buttonEnabled || (buttons && buttons.length > 0) || 
                          (settings.buttons && settings.buttons.length > 0);
        
        if (hasButtons) {
            const buttonCount = buttons?.length || settings.buttons?.length || 1;
            if (buttonCount >= 2) {
                showComponents.push('buttons2');
            } else {
                showComponents.push('buttons');
            }
        }

        const showKey = showComponents.join(',');
        const themeInfo = THEME_MAPPING[displayType?.toUpperCase()]?.[showKey];

        const result = {
            theme: themeInfo?.theme || (displayType?.toUpperCase() === 'BOX' ? 'T4' : 'T1'),
            code: themeInfo?.code || 'M1',
            cssClass: themeInfo?.cssClass || (displayType?.toUpperCase() === 'BOX' ? 'qdx_theme2-1' : 'qdx_theme1-1'),
            show: showComponents
        };

        console.log('🎨 테마 계산 상세:', {
            displayType: displayType?.toUpperCase(),
            imageEnabled: settings.imageEnabled,
            imageUrl: settings.imageUrl,
            images: settings.images,
            textEnabled: settings.textEnabled,
            titleContent: settings.titleContent,
            bodyContent: settings.bodyContent,
            msg: settings.msg,
            buttonEnabled: settings.buttonEnabled,
            buttonsLength: buttons?.length,
            settingsButtons: settings.buttons,
            hasButtons,
            showKey,
            result
        });

        return result;
    };

    useEffect(() => {
        if (!selections.displayType && !previewData) {
            const defaultData = createDefaultPreviewData("BAR");
            setPreviewData(defaultData);
        }
    }, [selections.displayType, previewData]);

    useEffect(() => {
        if (currentStep === 1 && selections.displayType) {
            // 🔥 1단계에서도 사용자 설정 기반 미리보기 표시
            if (preservedSettings && (preservedSettings.titleContent || preservedSettings.bodyContent || preservedSettings.imageUrl || preservedSettings.images || (preservedSettings.buttons && preservedSettings.buttons.length > 0))) {
                // 보존된 설정이 있으면 그것을 기반으로 미리보기 생성
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

                // 이미지 설정
                if (preservedSettings.imageUrl || preservedSettings.images) {
                    if (selections.displayType.toUpperCase() === 'SLIDE' && preservedSettings.images) {
                        // 🔥 슬라이드는 여러 이미지 지원
                        userBasedData.images = preservedSettings.images;
                    } else if (preservedSettings.imageUrl) {
                        // 일반 타입은 단일 이미지
                        userBasedData.images = [{
                            seq: 1,
                            url: preservedSettings.imageUrl,
                            action: preservedSettings.clickAction === 'link' ? 'L' : '',
                            linkUrl: preservedSettings.linkUrl || '',
                            linkOpt: preservedSettings.linkTarget === 'new' ? 'B' : 'S'
                        }];
                    }
                    userBasedData.show.push('images');
                }

                // 텍스트 설정
                if (preservedSettings.titleContent || preservedSettings.bodyContent) {
                    userBasedData.msg = {
                        title: preservedSettings.titleContent || '',
                        text: preservedSettings.bodyContent || ''
                    };
                    userBasedData.show.push('msg');
                }

                // 버튼 설정
                if (preservedSettings.buttons && preservedSettings.buttons.length > 0) {
                    userBasedData.buttons = preservedSettings.buttons.map((btn, index) => ({
                        seq: index + 1,
                        text: btn.text || '',
                        linkUrl: btn.url || '',
                        linkOpt: btn.target === 'new' ? 'B' : 'S'
                    }));
                    // 🔥 버튼 개수에 따라 show 배열에 추가
                    if (preservedSettings.buttons.length >= 2) {
                        userBasedData.show.push('buttons2');
                    } else {
                        userBasedData.show.push('buttons');
                    }
                }

                // 최종 설정된 미리보기 표시
                setPreviewData(userBasedData);
            } else {
                // 보존된 설정이 없으면 기본 미리보기
                const defaultData = createDefaultPreviewData(selections.displayType);
                setPreviewData(defaultData);
            }
        } else if (currentStep === 2 && selections.displayType && !previewData) {
            // 2단계로 넘어갔는데 미리보기 데이터가 없으면 기본 데이터 설정
            const defaultData = createDefaultPreviewData(selections.displayType);
            setPreviewData(defaultData);
        } else if (currentStep === 1 && !selections.displayType) {
            // 🔥 1단계로 돌아왔는데 displayType이 없으면 기본 BAR 미리보기 표시
            const defaultData = createDefaultPreviewData('BAR');
            setPreviewData(defaultData);
        }
    }, [selections.displayType, currentStep, preservedSettings]);

    useEffect(() => {
        console.log('🔄 미리보기 데이터 변경:', previewData);
        if (previewData && previewIframeRef.current?.contentWindow) {
            console.log('📤 iframe으로 데이터 전송:', previewData);
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

    // 🔥 iframe에서 HTML 생성 요청과 오늘하루 보지않기 상태 변경 처리
    useEffect(() => {
        const handleMessage = (e) => {
            if (e.data.type === 'generate_popup_html') {
                try {
                    // 🔥 import한 generatePopupHTML 함수 사용
                    const html = generatePopupHTML(e.data.messageId, e.data.data);

                    // iframe에 생성된 HTML 전송
                    previewIframeRef.current.contentWindow.postMessage({
                        type: 'popup_html_generated',
                        html: html
                    }, '*');

                    console.log('✅ 팝업 HTML 생성 및 전송 완료');
                } catch (error) {
                    console.error('❌ 팝업 HTML 생성 실패:', error);
                }
            } else if (e.data.type === 'today_option_changed') {
                // 🔥 오늘하루 보지않기 상태 변경
                console.log('📅 오늘하루 보지않기 상태 변경:', e.data.checked);
                setPreviewData(prev => ({
                    ...prev,
                    today: e.data.checked ? 'Y' : 'N'
                }));
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const getHeaderIcon = () => {
        switch(currentStep) {
            case 1: return <DisplayIcon />;
            case 2: return <ImageIcon />;
            default: return <DisplayIcon />;
        }
    };

    // UnifiedSettings에서 데이터 변경-> 테마 자동 재계산
    const handleSettingsDataChange = (jsonData) => {
        console.log('🔄 설정 데이터 변경:', jsonData);
        
        // 만약 텍스트가 활성화되어 있지만 데이터가 없다면
        if (!jsonData.msg || (!jsonData.msg.title && !jsonData.msg.text)) {
            console.log('⚠️ 텍스트 데이터가 비어있음, 기본값 사용');
        }
        
        // jsonData에서 직접 설정 정보 추출
        const settings = {
            imageEnabled: jsonData.images && jsonData.images.length > 0,
            imageUrl: jsonData.images?.[0]?.url,
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
                title: jsonData.msg?.title || basePreviewData.msg?.title || "",
                text: jsonData.msg?.text || basePreviewData.msg?.text || ""
            },
            buttons: jsonData.buttons?.map(btn => ({
                ...btn,
                text: btn.text || "",
                linkUrl: btn.linkUrl || "",
                linkOpt: btn.linkOpt || ""
            })) || basePreviewData.buttons || [],
            images: (() => {
                if (jsonData.images && jsonData.images.length > 0 &&
                    jsonData.images.some(img => img.url && img.url.trim() !== '')) {
                    return jsonData.images.map(img => ({
                        ...img,
                        url: img.url || "",
                        action: img.action || "",
                        linkUrl: img.linkUrl || "",
                        linkOpt: img.linkOpt || ""
                    }));
                } else {
                    return basePreviewData.images || [];
                }
            })()
        };

        console.log('🔄 최종 미리보기 데이터:', validatedData);
        setPreviewData(validatedData);
    };

    // UnifiedSettings에서 검증 상태 변경 시 호출
    const handleValidationChange = (isValid) => {
        setIsValidForSave(isValid);
        console.log('✅ 검증 상태:', isValid);
    };

    // 새로운 JSON 형식으로 변환
    const convertToNewJsonFormat = (originalData) => {
        if (!settingsRef.current) return null;

        const settings = settingsRef.current.getSettingsData?.() || {};
        const buttons = settingsRef.current.getButtonsData?.() || [];

        // Theme 자동 계산
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
        if (settings.imageEnabled && settings.imageUrl) {
            newFormat.images.push({
                seq: 1,
                url: settings.imageUrl,
                action: settings.clickAction === 'link' ? 'L' : 'N',
                linkUrl: settings.linkUrl || '',
                linkOpt: settings.linkTarget === 'new' ? 'B' : 'S'
            });
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

    // 오늘하루 보지않기 처리
    const handleTodayOption = () => {
        if (settingsRef.current) {
            const todayData = { ...previewData, today: 'Y' };

            if (previewIframeRef.current?.contentWindow) {
                previewIframeRef.current.contentWindow.postMessage({
                    type: 'show_preview',
                    data: todayData
                }, '*');
            }
            setShowTodayModal(true);
        }
    };

    // 실제로 보기 처리 - 전체화면으로 표시
    const handleRealView = () => {
        if (settingsRef.current?.validateSettings()) {
            const jsonData = settingsRef.current.getJsonData();
            console.log('🔍 실제 보기 데이터:', jsonData);

            // 🔥 전체화면 모달 생성
            const fullScreenHTML = generatePopupHTML('FULLSCREEN_' + Date.now(), jsonData);

            // 전체화면 div 생성
            const fullScreenDiv = document.createElement('div');
            fullScreenDiv.innerHTML = fullScreenHTML;
            fullScreenDiv.style.zIndex = '9999999';
            document.body.appendChild(fullScreenDiv);

            // 닫기 버튼 이벤트 추가
            const closeBtn = fullScreenDiv.querySelector('.qdx_close');
            const todayCheckbox = fullScreenDiv.querySelector('input[name="today"]');

            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    document.body.removeChild(fullScreenDiv);
                });
            }

            // 오늘하루 보지않기 체크박스 이벤트
            if (todayCheckbox) {
                todayCheckbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        alert('오늘 하루 이 메시지를 보지 않습니다.');
                        document.body.removeChild(fullScreenDiv);
                    }
                });
            }

            console.log('🖥️ 전체화면 팝업 표시됨');
        } else {
            alert('설정을 완료해주세요.');
        }
    };

    // 위치 변경 핸들러
    const handleLocationChange = (newLocation) => {
        setPreviewData(prev => ({
            ...prev,
            location: newLocation
        }));
        setShowLocationMenu(false); // 메뉴 닫기
        console.log('📍 위치 변경:', newLocation);
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
        let jsonForCopy = null;
        
        if (currentStep === 2 && settingsRef.current) {
            // 2단계에서는 실시간 설정 데이터 사용
            jsonForCopy = convertToNewJsonFormat(previewData);
        } else if (currentStep === 1) {
            // 🔥 1단계에서는 현재 선택된 디스플레이 타입에 맞게 필터링된 JSON 생성
            if (selections.displayType && preservedSettings) {
                // 선택된 디스플레이 타입의 설정을 가져와서 허용되는 컴포넌트만 포함
                const displayConfig = getDisplayConfig(selections.displayType);
                
                jsonForCopy = {
                    display: selections.displayType.toUpperCase(),
                    show: [],
                    location: 'TOP',
                    today: previewData?.today || 'N'
                };

                // 허용되는 컴포넌트만 추가
                if (displayConfig.image && (preservedSettings.imageUrl || preservedSettings.images)) {
                    if (selections.displayType.toUpperCase() === 'SLIDE' && preservedSettings.images) {
                        // 🔥 슬라이드는 여러 이미지 지원
                        jsonForCopy.images = preservedSettings.images;
                    } else if (preservedSettings.imageUrl) {
                        // 일반 타입은 단일 이미지
                        jsonForCopy.images = [{
                            seq: 1,
                            url: preservedSettings.imageUrl,
                            action: preservedSettings.clickAction === 'link' ? 'L' : '',
                            linkUrl: preservedSettings.clickAction === 'link' ? (preservedSettings.linkUrl || '') : '',
                            linkOpt: preservedSettings.linkTarget === 'new' ? 'B' : 'S'
                        }];
                    }
                    jsonForCopy.show.push('images');
                } else {
                    jsonForCopy.images = [];
                }

                if (displayConfig.text && (preservedSettings.titleContent || preservedSettings.bodyContent)) {
                    jsonForCopy.msg = {
                        title: preservedSettings.titleContent || '',
                        text: preservedSettings.bodyContent || ''
                    };
                    jsonForCopy.show.push('msg');
                } else {
                    jsonForCopy.msg = {};
                }

                if (displayConfig.button && preservedSettings.buttons && preservedSettings.buttons.length > 0) {
                    jsonForCopy.buttons = preservedSettings.buttons
                        .filter(btn => btn.text && btn.text.trim())
                        .map((btn, index) => ({
                            seq: index + 1,
                            text: btn.text,
                            linkUrl: btn.url || '',
                            linkOpt: btn.target === 'new' ? 'B' : 'S'
                        }));
                    if (jsonForCopy.buttons.length > 0) {
                        // 🔥 버튼 개수에 따라 show 배열에 추가
                        if (jsonForCopy.buttons.length >= 2) {
                            jsonForCopy.show.push('buttons2');
                        } else {
                            jsonForCopy.show.push('buttons');
                        }
                    }
                } else {
                    jsonForCopy.buttons = [];
                }
            } else {
                // 현재 미리보기 데이터 사용
                jsonForCopy = previewData;
            }
        } else {
            // 기타 경우에는 현재 미리보기 데이터 사용
            jsonForCopy = previewData;
        }
        
        if (jsonForCopy) {
            const jsonString = JSON.stringify(jsonForCopy, null, 2);
            navigator.clipboard.writeText(jsonString).then(() => {
                alert('JSON이 클립보드에 복사되었습니다!');
                setShowJsonModal(false);
            }).catch(err => {
                console.error('복사 실패:', err);
                alert('복사에 실패했습니다.');
            });
        }
    };

    // 제출/저장 핸들러
    const handleSubmit = () => {
        if (currentStep === 2) {
            // 2단계에서만 검증 수행
            if (settingsRef.current?.validateSettings()) {
                const jsonData = settingsRef.current?.getJsonData();
                console.log('✅ 설정 검증 성공');
                console.log('📤 전송 데이터:', jsonData);

                InAppService.showTestMessage(jsonData).then(success => {
                    if (success) {
                        alert('인앱 메시지가 전체 화면에 표시되었습니다!');
                    }
                });
            } else {
                console.log('❌ 설정 검증 실패');
                alert('입력되지 않은 필드가 있습니다. 빨간색으로 표시된 필드를 확인해주세요.');
            }
        } else if (currentStep === 1) {
            // 1단계에서는 다음 단계로 이동
            handleNext();
        }
    };
    
    // 뒤로 가기 핸들러 (설정 보존)
    const handleBackWithPreservation = () => {
        if (currentStep === 2 && settingsRef.current) {
            // 🔥 현재 설정을 보존
            const currentSettings = settingsRef.current.getSettingsData?.();
            const currentButtons = settingsRef.current.getButtonsData?.();
            
            if (currentSettings) {
                const preservedData = {
                    titleContent: currentSettings.titleContent || '',
                    bodyContent: currentSettings.bodyContent || '',
                    imageUrl: currentSettings.imageUrl || '',
                    linkUrl: currentSettings.linkUrl || '',
                    clickAction: currentSettings.clickAction || '',
                    linkTarget: currentSettings.linkTarget || 'current',
                    textEnabled: currentSettings.textEnabled || false,
                    imageEnabled: currentSettings.imageEnabled || false,
                    buttonEnabled: currentSettings.buttonEnabled || false,
                    buttons: currentButtons || []
                };

                // 🔥 슬라이드의 경우 현재 미리보기 데이터에서 images 배열도 보존
                if (selections.displayType === 'SLIDE' && previewData?.images) {
                    preservedData.images = previewData.images;
                }

                setPreservedSettings(preservedData);
                console.log('💾 설정 보존됨:', preservedData);
            }
        }
        
        // 🔥 1단계로 돌아갈 때 미리보기 데이터 유지하면서 다시 선택 가능하게
        handleBack();
    };

    // 미리보기 버튼들 렌더링 (우측 세로 바 형태)
    const renderPreviewButtons = () => {
        if (currentStep === 1 || currentStep === 2) {
            return (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    zIndex: 100,
                    background: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    border: '1px solid #e5e7eb'
                }}>
                    {/* 오늘하루 보지않기 체크박스 */}
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        color: '#374151'
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
                    
                    {/* JSON 버튼 */}
                    <button
                        onClick={() => setShowJsonModal(true)}
                        style={{
                            padding: '8px 16px',
                            background: '#fcad27',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        JSON 보기
                    </button>
                    
                    {/* 위치 설정 */}
                    <div style={{ position: 'relative' }} data-location-menu>
                        <button
                            title="위치 설정"
                            onClick={() => setShowLocationMenu(!showLocationMenu)}
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
                                gap: '6px'
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                             {previewData?.location || 'TOP'}
                        </button>
                        
                        {/* 위치 드롭다운 메뉴 */}
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
                                <button
                                    onClick={() => handleLocationChange('TOP')}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        background: previewData?.location === 'TOP' ? '#3b82f6' : 'transparent',
                                        color: previewData?.location === 'TOP' ? 'white' : '#374151',
                                        border: 'none',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    상단 (TOP)
                                </button>
                                <button
                                    onClick={() => handleLocationChange('MID')}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        background: previewData?.location === 'MID' ? '#3b82f6' : 'transparent',
                                        color: previewData?.location === 'MID' ? 'white' : '#374151',
                                        border: 'none',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    중앙 (MID)
                                </button>
                                <button
                                    onClick={() => handleLocationChange('BOT')}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        background: previewData?.location === 'BOT' ? '#3b82f6' : 'transparent',
                                        color: previewData?.location === 'BOT' ? 'white' : '#374151',
                                        border: 'none',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    하단 (BOT)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return null;
    };

    // 메인 콘텐츠 렌더링 (2단계 구조)
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
                        <style jsx>{`
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
                    {/* 미리보기 iframe */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        {/* 우측 컨트롤 버튼들 */}
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
        /* 폰트 스타일 강제 적용 */
        .qdx_text h2 *,
        .qdx_text p *,
        .qdx_text .qdx_text_content *,
        .qdx_text h2,
        .qdx_text p,
        .qdx_text .qdx_text_content {
            font-family: inherit !important;
        }
        
        /* 특정 폰트 클래스 강제 적용 */
        [style*="Nanum Gothic"] * {
            font-family: 'Nanum Gothic', sans-serif !important;
        }
        
        [style*="Nanum Myeongjo"] * {
            font-family: 'Nanum Myeongjo', serif !important;
        }
        
        [style*="Nanum Pen Script"] * {
            font-family: 'Nanum Pen Script', cursive !important;
        }
        
        [style*="Nanum Brush Script"] * {
            font-family: 'Nanum Brush Script', cursive !important;
        }
        
        /* 기존 CSS 오버라이드 */
        .qdx_popup_box * {
            font-family: inherit !important;
        }
        
        /* 기본 폰트 설정 */
        .qdx_text {
            font-family: 'Nanum Gothic', sans-serif !important;
        }
        
        /* 모든 텍스트 요소에 강제 적용 */
        .qdx_text span[style*="font-family"] {
            font-family: inherit !important;
        }
    </style>
</head>
<body>
    <script>
        // 🔥 iframe 내부에서는 parent에서 전달받은 HTML을 사용
        let localQdx = null;
        let qdxReady = false;
        let pendingPreview = null;
        
        // 로컬 QDX 초기화
        async function initLocalQdx() {
            try {
                const script = document.createElement('script');
                script.src = '../src/assets/qdx-renderer.js.umd.cjs';
                script.onload = () => {
                    setTimeout(() => {
                        if (window.QdxRenderer) {
                            localQdx = window.QdxRenderer;
                            // 서버 전송 방지
                            localQdx.showMsg = (id, data) => {
                                // parent에서 HTML 생성 요청
                                window.parent.postMessage({
                                    type: 'generate_popup_html',
                                    messageId: id,
                                    data: data
                                }, '*');
                            };
                            qdxReady = true;
                            console.log('✅ 로컬 QDX 준비 완료');
                            if (pendingPreview) {
                                showPreview(pendingPreview);
                                pendingPreview = null;
                            }
                        }
                    }, 100);
                };
                document.head.appendChild(script);
            } catch (error) {
                console.error('❌ 로컬 QDX 초기화 실패:', error);
            }
        }
        
        // 🔥 Swiper 초기화 함수
        function initSwiper(containerId) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn('Swiper container not found:', containerId);
                return;
            }

            // CDN에서 Swiper 로드
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

        // 🔥 Swiper 생성 함수 (3초마다 자동 슬라이드)
        function createSwiper(containerId) {
            try {
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
                    },
                    on: {
                        init: function() {
                            console.log('✅ Swiper 초기화 성공:', containerId);
                        },
                        slideChange: function() {
                            console.log(\`📍 슬라이드 변경: \${this.activeIndex + 1}/\${this.slides.length}\`);
                        }
                    }
                });
                
                console.log('🎯 Swiper 객체 생성됨:', swiper);
                return swiper;
            } catch (error) {
                console.error('❌ Swiper 생성 실패:', error);
                return null;
            }
        }
        
        function showPreview(data) {
            console.log('📥 iframe에서 미리보기 데이터 수신:', data);
            if (!qdxReady || !localQdx) {
                console.log('⏳ QDX 준비 안됨, 대기 중...');
                pendingPreview = data;
                return;
            }
            console.log('🚀 QDX showMsg 호출');
            localQdx.showMsg('TEST_' + Date.now(), data);
        }
        
        window.addEventListener('message', (e) => {
            console.log('📨 iframe 메시지 수신:', e.data);
            if (e.data.type === 'show_preview') {
                console.log('🎯 show_preview 메시지 처리');
                showPreview(e.data.data);
            } else if (e.data.type === 'popup_html_generated') {
                console.log('🏗️ popup_html_generated 메시지 처리');
                console.log('📄 받은 HTML 길이:', e.data.html?.length);
                
                document.getElementById('qdx_popup_wrap')?.remove();
                document.body.insertAdjacentHTML('beforeend', e.data.html);
                adjustPreviewPosition();
                
                // 🔥 폰트 스타일 재적용
                setTimeout(() => {
                    const popup = document.getElementById('qdx_popup_wrap');
                    if (popup) {
                        applyFontStyles(popup);
                        
                        // 🔥 슬라이드 타입이면 Swiper 초기화
                        const slideElement = popup.querySelector('#qdx_slide');
                        if (slideElement) {
                            console.log('🎡 슬라이드 감지됨, Swiper 초기화 시작...');
                            setTimeout(() => {
                                initSwiper('qdx_slide');
                            }, 200);
                        }
                    }
                }, 100);
                
                // 🔥 오늘하루 보지않기 체크박스 이벤트 추가
                const todayCheckbox = document.querySelector('input[name="today"]');
                if (todayCheckbox) {
                    todayCheckbox.addEventListener('change', (event) => {
                        // 부모 창에 상태 변경 알림
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
            if (popup) {
                popup.style.background = '#fafafa';
                
                // 🔥 폰트 스타일 강제 적용
                applyFontStyles(popup);
                
                const contElement = popup.querySelector('.qdx_cont');
                if (contElement) {
                    contElement.style.boxShadow = 'rgba(0, 0, 0, 0.2) 8px 8px 24px 8px';
                    
                    // 🔥 슬라이드와 박스형 크기 조정
                    const slideElement = popup.querySelector('#qdx_slide');
                    const boxElement = popup.querySelector('#qdx_type_slide, #qdx_type_box');
                    
                    if (slideElement || boxElement) {
                        contElement.style.transform = 'scale(0.85)';
                        contElement.style.transformOrigin = 'center';
                        console.log('🔧 슬라이드/박스형 크기 조정 완료');
                    }
                }
            }
        }
        
        // 🔥 폰트 스타일 강제 적용 함수 (완전 재작성)
        function applyFontStyles(container) {
            console.log('🎨 폰트 스타일 적용 시작');
            
            // 모든 텍스트 컨테이너 찾기
            const textContainers = container.querySelectorAll('.qdx_text');
            console.log('🎨 텍스트 컨테이너 개수:', textContainers.length);
            
            textContainers.forEach((textContainer, containerIndex) => {
                console.log(\`🎨 컨테이너 \${containerIndex}:\`, textContainer.outerHTML);
                
                // 컨테이너 내의 모든 요소에 스타일 적용
                const allElements = textContainer.querySelectorAll('*');
                allElements.forEach((element, elementIndex) => {
                    const style = element.getAttribute('style');
                    if (style) {
                        console.log(\`🎨 요소 \${containerIndex}-\${elementIndex} 스타일:\`, style);
                        
                        // 스타일을 파싱하여 하나씩 적용
                        const styleDeclarations = style.split(';').filter(decl => decl.trim());
                        styleDeclarations.forEach(declaration => {
                            const [property, value] = declaration.split(':').map(s => s.trim());
                            if (property && value) {
                                element.style.setProperty(property, value, 'important');
                                console.log(\`🎨 적용: \${property} = \${value}\`);
                            }
                        });
                    }
                });
            });
            
            console.log('🎨 폰트 스타일 적용 완료');
        }
        
        // 별점 선택 함수 -> 활성화 가능하게 해놓음
        function selectStar(score) {
            // 모든 별점 초기화
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
                                    onClick={handleCopyJson}
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
                                    onClick={() => setShowJsonModal(false)}
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
                                let jsonToShow = null;
                                
                                if (currentStep === 2 && settingsRef.current) {
                                    jsonToShow = convertToNewJsonFormat(previewData);
                                } else if (currentStep === 1) {
                                    // 🔥 1단계에서는 현재 선택된 디스플레이 타입에 맞게 필터링된 JSON 생성
                                    if (selections.displayType && preservedSettings) {
                                        const displayConfig = getDisplayConfig(selections.displayType);
                                        
                                        jsonToShow = {
                                            display: selections.displayType.toUpperCase(),
                                            show: [],
                                            location: 'TOP',
                                            today: previewData?.today || 'N'
                                        };

                                        // 허용되는 컴포넌트만 추가
                                        if (displayConfig.image && (preservedSettings.imageUrl || preservedSettings.images)) {
                                            if (selections.displayType.toUpperCase() === 'SLIDE' && preservedSettings.images) {
                                                // 🔥 슬라이드는 여러 이미지 지원
                                                jsonToShow.images = preservedSettings.images;
                                            } else if (preservedSettings.imageUrl) {
                                                // 일반 타입은 단일 이미지
                                                jsonToShow.images = [{
                                                    seq: 1,
                                                    url: preservedSettings.imageUrl,
                                                    action: preservedSettings.clickAction === 'link' ? 'L' : '',
                                                    linkUrl: preservedSettings.clickAction === 'link' ? (preservedSettings.linkUrl || '') : '',
                                                    linkOpt: preservedSettings.linkTarget === 'new' ? 'B' : 'S'
                                                }];
                                            }
                                            jsonToShow.show.push('images');
                                        } else {
                                            jsonToShow.images = [];
                                        }

                                        if (displayConfig.text && (preservedSettings.titleContent || preservedSettings.bodyContent)) {
                                            jsonToShow.msg = {
                                                title: preservedSettings.titleContent || '',
                                                text: preservedSettings.bodyContent || ''
                                            };
                                            jsonToShow.show.push('msg');
                                        } else {
                                            jsonToShow.msg = {};
                                        }

                                        if (displayConfig.button && preservedSettings.buttons && preservedSettings.buttons.length > 0) {
                                            jsonToShow.buttons = preservedSettings.buttons
                                                .filter(btn => btn.text && btn.text.trim())
                                                .map((btn, index) => ({
                                                    seq: index + 1,
                                                    text: btn.text,
                                                    linkUrl: btn.url || '',
                                                    linkOpt: btn.target === 'new' ? 'B' : 'S'
                                                }));
                                            if (jsonToShow.buttons.length > 0) {
                                                // 🔥 버튼 개수에 따라 show 배열에 추가
                                                if (jsonToShow.buttons.length >= 2) {
                                                    jsonToShow.show.push('buttons2');
                                                } else {
                                                    jsonToShow.show.push('buttons');
                                                }
                                            }
                                        } else {
                                            jsonToShow.buttons = [];
                                        }
                                    } else {
                                        jsonToShow = previewData;
                                    }
                                } else {
                                    jsonToShow = previewData;
                                }
                                
                                return jsonToShow ? JSON.stringify(jsonToShow, null, 2) : '데이터가 없습니다.';
                            })()}
                        </pre>
                    </div>
                </div>
            )}

            {/* 오늘하루 보지않기 모달 */}
            {showTodayModal && (
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
                        maxWidth: '400px',
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
                                오늘하루 보지않기 미리보기
                            </h3>
                            <button
                                onClick={() => setShowTodayModal(false)}
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
                        <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 16px 0' }}>
                            사용자가 "오늘 하루 보지 않기"를 체크했을 때의 상태입니다.
                        </p>
                        <div style={{
                            background: '#f8f9fa',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            padding: '16px',
                            fontSize: '14px'
                        }}>
                            today: "{previewData?.today === 'Y' ? 'Y' : 'N'}"
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InAppModule;
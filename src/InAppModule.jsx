// InAppModule.jsx - 수정된 버전
import React, { useEffect, useRef, useState } from 'react';
import {
    ModuleWrapper,
    ContentSection,
    Header,
    HeaderIcon,
    StepTitle,
    StepNumber,
    ContentArea,
    NavigationArea,
    BackButton,
    NextButton,
    PreviewSection
} from './styles/StyledComponents';

import {
    BackIcon,
    NextIcon,
    DisplayIcon,
    ImageIcon
} from './components/Icons';

// 분리된 컴포넌트들 import
import SelectionGridComponent from './components/SelectionGrid';
import { UnifiedSettings } from './components/UnifiedSettings';

// 커스텀 훅들 import
import { useInAppData, useInAppSelections } from './hooks/useInAppData';

// 유틸리티 함수들 import
import {
    getCurrentItems,
    getCurrentStepTitle,
    getCurrentStepNumber,
    isNextEnabled,
    isLastStep
} from './utils/inAppUtils';

// 서비스 import
import { InAppService } from './services/inAppService';

// 기본 미리보기 데이터 생성 함수
const getDefaultPreviewData = (displayType) => {
    const baseData = {
        images: [{
            seq: 1,
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhFjJgDxmK9CVk3XxTiitDyZLIOKJvtZNLrg&s",
            action: "",
            linkUrl: "",
            linkOpt: ""
        }],
        msg: {
            title: "미리보기 제목",
            text: "미리보기 내용입니다."
        },
        today: "Y",
        buttons: []
    };

    // 소문자를 대문자로 변환
    const upperDisplayType = displayType?.toUpperCase();

    switch(upperDisplayType) {
        case 'BAR':
            return {
                ...baseData,
                display: "BAR",
                theme: "T3",
                template: "M3",
                location: "TOP"
            };
        case 'BOX':
            return {
                ...baseData,
                display: "BOX",
                theme: "T1",
                template: "M1",
                location: "MID"
            };
        case 'STAR':
            return {
                ...baseData,
                display: "STAR",
                theme: "T9",
                template: "M1",
                location: "MID"
            };
        case 'SLIDE':
            return {
                ...baseData,
                display: "SLIDE",
                theme: "T11",
                template: "M4",
                location: "MID",
                buttons: [{
                    seq: 1,
                    text: "",
                    linkUrl: "",
                    linkOpt: ""
                }]
            };
        default:
            console.log('⚠️ 알 수 없는 표시형태:', displayType);
            return null;
    }
};

const InAppModule = ({
                         config = {},
                         onDataChange = () => {},
                         initialData = null
                     }) => {
    // 참조들
    const settingsRef = useRef();
    const previewIframeRef = useRef();

    // 프리뷰 데이터와 검증 상태
    const [previewData, setPreviewData] = useState(null);
    const [isValidForSave, setIsValidForSave] = useState(false);

    // 커스텀 훅 사용 (2단계 구조)
    const { displayTypes, locations, loading, error } = useInAppData(config);

    const {
        currentStep,
        selections,
        handleItemSelect,
        handleNext,
        handleBack,
        setInitialData
    } = useInAppSelections(onDataChange, loading);

    // 초기 데이터 설정
    useEffect(() => {
        setInitialData(initialData);
    }, [initialData, loading]);

    // 최초 mount 시 "BOX" 타입 기본 미리보기
    useEffect(() => {
        if (!selections.displayType && !previewData) {
            const defaultData = getDefaultPreviewData("BAR");
            setPreviewData(defaultData);
            console.log('🎨 최초 BOX 미리보기 데이터 설정:', defaultData);
        }
        // 만약 displayTypes가 로딩된 뒤에 최초 세팅을 원하면, displayTypes 의존성도 추가
    }, [selections.displayType, previewData]);


    // 1단계에서 표시형태 선택시 즉시 미리보기 표시
    useEffect(() => {
        if (currentStep === 1 && selections.displayType) {
            console.log('🔍 선택된 표시형태:', selections.displayType);
            const defaultData = getDefaultPreviewData(selections.displayType);
            setPreviewData(defaultData);
            console.log('🎨 미리보기 데이터 설정:', defaultData);
        }
    }, [selections.displayType, currentStep]);

    // 미리보기 데이터 전송 - 즉시 전송
    useEffect(() => {
        if (previewData && previewIframeRef.current?.contentWindow) {
            try {
                previewIframeRef.current.contentWindow.postMessage({
                    type: 'show_preview',
                    data: previewData
                }, '*');
                console.log('📤 미리보기 전송 완료:', previewData);
            } catch (error) {
                console.error('미리보기 전송 실패:', error);
            }
        }
    }, [previewData]);

    // iframe onLoad 이벤트 추가
    const handleIframeLoad = () => {
        console.log('📱 iframe 로드 완료');
        // iframe이 로드되면 현재 previewData가 있으면 즉시 전송
        if (previewData) {
            try {
                previewIframeRef.current.contentWindow.postMessage({
                    type: 'show_preview',
                    data: previewData
                }, '*');
                console.log('📤 초기 미리보기 전송:', previewData);
            } catch (error) {
                console.error('초기 미리보기 전송 실패:', error);
            }
        }
    };
    const getHeaderIcon = () => {
        switch(currentStep) {
            case 1: return <DisplayIcon />;
            case 2: return <ImageIcon />;
            default: return <DisplayIcon />;
        }
    };

    // UnifiedSettings에서 데이터 변경 시 호출
    const handleSettingsDataChange = (jsonData) => {
        // trim 오류 방지를 위해 필수 필드 검증
        const validatedData = {
            ...jsonData,
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
        console.log('📊 설정 데이터 변경:', validatedData);
    };

    // UnifiedSettings에서 검증 상태 변경 시 호출
    const handleValidationChange = (isValid) => {
        setIsValidForSave(isValid);
        console.log('✅ 검증 상태:', isValid);
    };

    // 제출/저장 핸들러
    const handleSubmit = () => {
        if (currentStep === 2) {
            // 설정 검증
            if (settingsRef.current?.validateSettings()) {
                const jsonData = settingsRef.current?.getJsonData();

                console.log('✅ 설정 검증 성공');
                console.log('📤 전송 데이터:', jsonData);

                // qdx.showMsg 호출
                InAppService.showTestMessage(jsonData).then(success => {
                    if (success) {
                        alert('인앱 메시지가 전체 화면에 표시되었습니다!');
                    }
                });
            } else {
                console.log('❌ 설정 검증 실패');
                alert('입력되지 않은 필드가 있습니다. 빨간색으로 표시된 필드를 확인해주세요.');
            }
        } else {
            handleNext();
        }
    };

    // 전체화면 미리보기 핸들러
    const handleFullScreenPreview = () => {
        if (previewData) {
            InAppService.showPreview(previewData);
        } else {
            alert('미리보기할 데이터가 없습니다.');
        }
    };

    // 메인 콘텐츠 렌더링 (2단계 구조)
    const renderContent = () => {
        if (currentStep === 2) {
            return (
                <UnifiedSettings
                    ref={settingsRef}
                    displayType={selections.displayType}
                    onDataChange={handleSettingsDataChange}
                    onValidationChange={handleValidationChange}
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
                        {/* 회전하는 프로그레스 인디케이터 */}
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
                        <BackButton onClick={handleBack} disabled={currentStep === 1}>
                            <BackIcon />
                        </BackButton>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <NextButton
                                onClick={handleSubmit}
                                disabled={!isNextEnabled(currentStep, selections) || (currentStep === 2 && !isValidForSave)}
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

                {/* 미리보기 섹션 - PreviewArea 박스 없이 직접 표시 */}
                <PreviewSection>
                    {/* 헤더 - 항상 버튼 표시 */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        paddingBottom: '16px',
                    }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {/* 오늘하루 보지않기 체크박스 */}
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: '#374151'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={previewData?.today === 'Y'}
                                    onChange={(e) => {
                                        if (previewData) {
                                            const updatedData = {
                                                ...previewData,
                                                today: e.target.checked ? 'Y' : 'N'
                                            };
                                            setPreviewData(updatedData);
                                        }
                                    }}
                                    disabled={!previewData}
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        cursor: previewData ? 'pointer' : 'not-allowed'
                                    }}
                                />
                                오늘하루 보지않기
                            </label>

                            {/* 전체화면 버튼 */}
                            <button
                                onClick={handleFullScreenPreview}
                                disabled={!previewData}
                                style={{
                                    padding: '10px 10px',
                                    background: previewData ? '#169DAF' : '#9ca3af',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    fontSize: '14px',
                                    cursor: previewData ? 'pointer' : 'not-allowed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s ease',
                                    marginLeft: '12px'
                                }}
                            >
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* QDX 미리보기 - PreviewSection에 직접 표시 */}
                    <iframe
                        ref={previewIframeRef}
                        onLoad={handleIframeLoad}
                        style={{
                            width: '100%',
                            flex: 1,
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
    <style>
#qdx_popup_wrap {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: #fafafa !important;
    z-index: 2147483647 !important;
    display: block !important;
    overflow: auto !important;
}

#qdx_popup_wrap .qdx_close img {
    filter: invert(100%) grayscale(100%) brightness(20%) !important;
}

#qdx_type_box,
#qdx_type_slide {
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-60%, -60%) scale(0.5) !important;
    transform-origin: center center !important;
}

#qdx_type_bar,
 {
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-60%, -60%) scale(0.9) !important;
    transform-origin: center center !important;
}

#qdx_popup_wrap .qdx_close_box .qdx_close_today {
color: #838383 !important;
}

.qdx_cont {
    box-shadow: 0 8px 32px rgba(0,0,0,0.22) !important;
    border-radius: 18px !important;
}
    </style>
</head>

<body>
    <script src="https://quadmax.co.kr/qdx/qdx-renderer.js"></script>
    <script>
        let qdxReady = false;
        let pendingPreview = null;
        
        function initQdx() {
            try {
                if (window.qdx && typeof window.qdx.init === 'function') {
                    qdx.init({
                        "api_key": "8jaAWd0Zp7POcZYLWDBdCg==",
                        "cntnrId": "easycore",
                        "serverUrl": "https://quadmax.co.kr"
                    });
                    qdxReady = true;
                    console.log('✅ QDX 초기화 성공');
                    
                    // 대기중인 미리보기가 있으면 표시
                    if (pendingPreview) {
                        showPreview(pendingPreview);
                        pendingPreview = null;
                    }
                } else {
                    console.log('⏳ QDX 아직 로드 안됨, 재시도...');
                    setTimeout(initQdx, 100);
                }
            } catch (error) {
                console.error('❌ QDX 초기화 실패:', error);
                setTimeout(initQdx, 500);
            }
        }
        
        function showPreview(data) {
            if (!data) {
                console.log('데이터 없음');
                return;
            }
            
            // QDX가 준비되지 않았으면 대기
            if (!qdxReady) {
                console.log('⏳ QDX 준비 중... 미리보기 대기');
                pendingPreview = data;
                return;
            }
            
            try {
                // 기존 팝업 제거
                const existingPopup = document.getElementById('qdx_popup_wrap');
                if (existingPopup) {
                    existingPopup.remove();
                }
                
                console.log('📱 미리보기 표시:', data);
                const messageId = 'PREVIEW_' + Date.now();
                qdx.showMsg(messageId, data);
                
            } catch (error) {
                console.error('❌ 미리보기 실패:', error);
            }
        }
        
        window.addEventListener('message', function (e) {
            if (e.data.type === 'show_preview' && e.data.data) {
                console.log('📨 메시지 수신:', e.data.data);
                showPreview(e.data.data);
            }
        });
        
        // 즉시 초기화 시작
        initQdx();
    </script>
</body>
</html>
                        `}
                        title="QDX Preview"
                        sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                </PreviewSection>

            </ModuleWrapper>
        </div>
    );
};

export default InAppModule;
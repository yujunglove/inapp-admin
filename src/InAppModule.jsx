// InAppModule.jsx - CDN CSS + 로컬 JS 하이브리드 (최종 버전)
import React, { useEffect, useRef, useState } from 'react';
import {
    ModuleWrapper,
    ContentSection,
    Header,
    HeaderIcon,
    StepTitle,
    StepNumber,
    ContentArea,
    PreviewSection
} from './styles/StyledComponents';

import {
    DisplayIcon
} from './components/Icons';

// 서비스 import
import { InAppService } from './services/inAppService';

// 공통코드 기반 설정 데이터
const DISPLAY_TYPES = {
    BAR: {
        name: "바형",
        defaultLocation: "TOP",
        themes: [
            { code: "T1", name: "이미지형", template: "M1" },
            { code: "T2", name: "텍스트형", template: "M2" },
            { code: "T3", name: "이미지 + 텍스트형", template: "M3" }
        ]
    },
    BOX: {
        name: "박스형",
        defaultLocation: "MID",
        themes: [
            { code: "T4", name: "이미지형", template: "M1" },
            { code: "T5", name: "이미지형 + 버튼1", template: "M4" },
            { code: "T6", name: "이미지형 + 버튼2", template: "M5" },
            { code: "T7", name: "이미지형 + 텍스트", template: "M3" },
            { code: "T8", name: "이미지형 + 텍스트 + 버튼1", template: "M6" },
            { code: "T9", name: "이미지형 + 텍스트 + 버튼2", template: "M7" }
        ]
    },
    SLIDE: {
        name: "슬라이드형",
        defaultLocation: "MID",
        themes: [
            { code: "T10", name: "이미지형", template: "M1" },
            { code: "T11", name: "이미지형 + 버튼1", template: "M4" },
            { code: "T12", name: "이미지형 + 버튼2", template: "M5" },
            { code: "T13", name: "이미지형 + 텍스트", template: "M3" },
            { code: "T14", name: "이미지형 + 텍스트 + 버튼1", template: "M6" },
            { code: "T15", name: "이미지형 + 텍스트 + 버튼2", template: "M7" }
        ]
    },
    STAR: {
        name: "별점형",
        defaultLocation: "BOT",
        themes: [
            { code: "T16", name: "텍스트형", template: "M8" }
        ]
    }
};

const TEMPLATE_CONFIG = {
    M1: { name: "이미지", hasImage: true, hasText: false, buttonCount: 0 },
    M2: { name: "텍스트", hasImage: false, hasText: true, buttonCount: 0 },
    M3: { name: "이미지 + 텍스트", hasImage: true, hasText: true, buttonCount: 0 },
    M4: { name: "이미지 + 버튼 1", hasImage: true, hasText: false, buttonCount: 1 },
    M5: { name: "이미지 + 버튼 2", hasImage: true, hasText: false, buttonCount: 2 },
    M6: { name: "이미지 + 텍스트 + 버튼 1", hasImage: true, hasText: true, buttonCount: 1 },
    M7: { name: "이미지 + 텍스트 + 버튼 2", hasImage: true, hasText: true, buttonCount: 2 },
    M8: { name: "설문", hasImage: false, hasText: true, buttonCount: 0 }
};

// 표시형태별 기본 데이터 생성 함수
const createDefaultData = (displayType, themeCode = null, templateCode = null) => {
    const displayConfig = DISPLAY_TYPES[displayType];
    if (!displayConfig) return null;

    const selectedTheme = themeCode
        ? displayConfig.themes.find(t => t.code === themeCode)
        : displayConfig.themes[0];

    if (!selectedTheme) return null;

    const template = templateCode || selectedTheme.template;
    const templateConfig = TEMPLATE_CONFIG[template];

    const show = [];
    if (templateConfig.hasImage) show.push("images");
    if (templateConfig.hasText) show.push("msg");
    if (templateConfig.buttonCount > 0) show.push("buttons");

    const defaultImages = templateConfig.hasImage ? [{
        seq: 1,
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhFjJgDxmK9CVk3XxTiitDyZLIOKJvtZNLrg&s",
        action: "L",
        linkUrl: "http://www.naver.com",
        linkOpt: "B"
    }] : [];

    const defaultButtons = [];
    for (let i = 0; i < templateConfig.buttonCount; i++) {
        defaultButtons.push({
            seq: i + 1,
            text: `버튼 ${i + 1}`,
            linkUrl: "http://www.example.com",
            linkOpt: "B"
        });
    }

    return {
        display: displayType,
        theme: selectedTheme.code,
        template: template,
        show: show,
        location: displayConfig.defaultLocation,
        images: defaultImages,
        msg: {
            title: `${displayConfig.name} 테스트`,
            text: `${selectedTheme.name} 스타일입니다.`
        },
        today: "Y",
        buttons: defaultButtons
    };
};

const InAppModule = ({
                         config = {},
                         onDataChange = () => {},
                         initialData = null
                     }) => {
    // 참조들
    const previewIframeRef = useRef();

    // 현재 선택된 타입과 미리보기 데이터
    const [currentType, setCurrentType] = useState('BOX');
    const [currentTheme, setCurrentTheme] = useState('T4');
    const [previewData, setPreviewData] = useState(() => createDefaultData('BOX'));
    const [useLocalVersion, setUseLocalVersion] = useState(false);

    // 타입 변경 핸들러
    const handleTypeChange = (type) => {
        setCurrentType(type);
        const defaultTheme = DISPLAY_TYPES[type].themes[0].code;
        setCurrentTheme(defaultTheme);
        const newData = createDefaultData(type, defaultTheme);
        setPreviewData(newData);
        console.log(`🔄 ${type}형으로 변경:`, newData);
    };

    // 테마 변경 핸들러
    const handleThemeChange = (themeCode) => {
        setCurrentTheme(themeCode);
        const newData = createDefaultData(currentType, themeCode);
        setPreviewData(newData);
        console.log(`🎨 테마 변경 ${themeCode}:`, newData);
    };

    // 최초 로드
    useEffect(() => {
        const defaultData = createDefaultData('BOX');
        console.log('🎨 최초 BOX 미리보기 데이터 설정:', defaultData);
    }, []);

    // 미리보기 데이터 전송
    useEffect(() => {
        if (previewData && previewIframeRef.current?.contentWindow) {
            try {
                previewIframeRef.current.contentWindow.postMessage({
                    type: 'show_preview',
                    data: previewData,
                    useLocal: useLocalVersion
                }, '*');
                console.log('📤 미리보기 전송 완료:', previewData);
            } catch (error) {
                console.error('미리보기 전송 실패:', error);
            }
        }
    }, [previewData, useLocalVersion]);

    // iframe onLoad 이벤트
    const handleIframeLoad = () => {
        console.log('📱 iframe 로드 완료');
        if (previewData) {
            try {
                previewIframeRef.current.contentWindow.postMessage({
                    type: 'show_preview',
                    data: previewData,
                    useLocal: useLocalVersion
                }, '*');
                console.log('📤 초기 미리보기 전송:', previewData);
            } catch (error) {
                console.error('초기 미리보기 전송 실패:', error);
            }
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

    // 오늘하루 보지않기 토글
    const handleTodayChange = (checked) => {
        const updatedData = {
            ...previewData,
            today: checked ? 'Y' : 'N'
        };
        setPreviewData(updatedData);
    };

    return (
        <div className="qdx_adm_wrap">
            <ModuleWrapper>
                <ContentSection>
                    <Header>
                        <HeaderIcon>
                            <DisplayIcon />
                        </HeaderIcon>
                        <div style={{ flex: 1 }}>
                            <StepTitle>
                                QDX 테스트 - {currentType}형 ({useLocalVersion ? '로컬' : 'CDN'})
                            </StepTitle>
                            <p style={{
                                color: '#6b7280',
                                fontSize: '14px',
                                margin: '4px 0 0 0',
                                fontWeight: '400'
                            }}>
                                {useLocalVersion ? 'CDN CSS + 로컬 JS' : '완전 CDN 버전'}
                            </p>
                        </div>
                        <StepNumber>
                            1/1
                        </StepNumber>
                    </Header>

                    <ContentArea style={{
                        maxHeight: 'calc(100vh - 140px)',
                        overflowY: 'auto',
                        overflowX: 'hidden'
                    }}>
                        <div style={{
                            padding: '20px',
                            background: 'white',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                        }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#374151' }}>
                                QDX 테스트 설정
                            </h3>

                            {/* 버전 선택 */}
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#374151' }}>
                                    버전 선택
                                </h4>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => setUseLocalVersion(false)}
                                        style={{
                                            padding: '8px 16px',
                                            background: !useLocalVersion ? '#10b981' : '#f1f5f9',
                                            color: !useLocalVersion ? 'white' : '#374151',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        CDN 버전 (완전 작동)
                                    </button>
                                    <button
                                        onClick={() => setUseLocalVersion(true)}
                                        style={{
                                            padding: '8px 16px',
                                            background: useLocalVersion ? '#f59e0b' : '#f1f5f9',
                                            color: useLocalVersion ? 'white' : '#374151',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        로컬 JS + CDN CSS
                                    </button>
                                </div>
                            </div>

                            {/* 타입 선택 버튼들 */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                marginBottom: '20px',
                                flexWrap: 'wrap'
                            }}>
                                {Object.keys(DISPLAY_TYPES).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleTypeChange(type)}
                                        style={{
                                            padding: '8px 16px',
                                            background: currentType === type ? '#3b82f6' : '#f1f5f9',
                                            color: currentType === type ? 'white' : '#374151',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: currentType === type ? '600' : '400'
                                        }}
                                    >
                                        {DISPLAY_TYPES[type].name}
                                    </button>
                                ))}
                            </div>

                            {/* 테마 선택 */}
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#374151' }}>
                                    테마 선택
                                </h4>
                                <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    flexWrap: 'wrap'
                                }}>
                                    {DISPLAY_TYPES[currentType]?.themes.map((theme) => (
                                        <button
                                            key={theme.code}
                                            onClick={() => handleThemeChange(theme.code)}
                                            style={{
                                                padding: '6px 12px',
                                                background: currentTheme === theme.code ? '#10b981' : '#ffffff',
                                                color: currentTheme === theme.code ? 'white' : '#374151',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: currentTheme === theme.code ? '600' : '400'
                                            }}
                                        >
                                            {theme.code}: {theme.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 선택된 타입 정보 */}
                            <div style={{
                                background: '#f8fafc',
                                padding: '16px',
                                borderRadius: '6px',
                                marginBottom: '16px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>표시형태:</strong> {previewData.display}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>테마:</strong> {previewData.theme}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>템플릿:</strong> {previewData.template}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>위치:</strong> {previewData.location}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>표시 요소:</strong> {previewData.show.join(', ')}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>제목:</strong> {previewData.msg.title}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>내용:</strong> {previewData.msg.text}
                                </div>

                                {previewData.images && previewData.images.length > 0 && (
                                    <div style={{ marginBottom: '8px' }}>
                                        <strong>이미지 개수:</strong> {previewData.images.length}개
                                    </div>
                                )}

                                {previewData.buttons && previewData.buttons.length > 0 && (
                                    <div style={{ marginBottom: '8px' }}>
                                        <strong>버튼:</strong> {previewData.buttons.map(btn => btn.text).join(', ')}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleFullScreenPreview}
                                style={{
                                    padding: '10px 20px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                전체화면 미리보기
                            </button>
                        </div>
                    </ContentArea>
                </ContentSection>

                {/* 미리보기 섹션 */}
                <PreviewSection>
                    {/* 헤더 */}
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
                                    onChange={(e) => handleTodayChange(e.target.checked)}
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        cursor: 'pointer'
                                    }}
                                />
                                오늘하루 보지않기
                            </label>

                            {/* 전체화면 버튼 */}
                            <button
                                onClick={handleFullScreenPreview}
                                style={{
                                    padding: '10px 10px',
                                    background: '#169DAF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    fontSize: '14px',
                                    cursor: 'pointer',
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

                    {/* QDX 미리보기 */}
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
    <title>QDX Test</title>
    <!-- CDN CSS는 항상 로드 -->
    <link rel="stylesheet" href="https://quadmax.co.kr/qdx/css/qdx.css">
    <link rel="stylesheet" href="https://quadmax.co.kr/qdx/css/qdx-theme.css">
    
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

#qdx_type_box,
#qdx_type_slide {
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-60%, -60%) scale(0.5) !important;
    transform-origin: center center !important;
}

#qdx_type_bar {
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-60%, -60%) scale(0.9) !important;
    transform-origin: center center !important;
}

#qdx_type_star {
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) scale(0.7) !important;
    transform-origin: center center !important;
}

.qdx_cont {
    box-shadow: 0 8px 32px rgba(0,0,0,0.22) !important;
    border-radius: 18px !important;
}
    </style>
</head>

<body>
    <!-- CDN JS는 기본으로 로드 -->
    <script src="https://quadmax.co.kr/qdx/qdx-renderer.js"></script>
    
    <script>
        let cdnQdx = null;
        let localQdx = null;
        let qdxReady = false;
        let pendingPreview = null;
        let useLocalVersion = false;
        
        async function initQdx() {
            try {
                // CDN QDX 초기화
                if (window.qdx && typeof window.qdx.init === 'function') {
                    await window.qdx.init({
                        "api_key": "8jaAWd0Zp7POcZYLWDBdCg==",
                        "cntnrId": "easycore",
                        "serverUrl": "https://quadmax.co.kr"
                    });
                    cdnQdx = window.qdx;
                    console.log('✅ CDN QDX 초기화 완료');
                } else {
                    console.log('⏳ CDN QDX 로드 대기...');
                    setTimeout(initQdx, 100);
                    return;
                }
                
                // 로컬 QDX 로드 시도
                await loadLocalQdx();
                
            } catch (error) {
                console.error('❌ QDX 초기화 실패:', error);
                setTimeout(initQdx, 500);
            }
        }
        
        async function loadLocalQdx() {
            try {
                const script = document.createElement('script');
                script.src = '../src/assets/qdx-renderer.js.umd.cjs';
                script.onload = () => {
                    setTimeout(() => {
                        if (window.QdxRenderer && window.QdxRenderer !== cdnQdx) {
                            localQdx = window.QdxRenderer;
                            console.log('✅ 로컬 QDX 로드 완료');
                        }
                        
                        qdxReady = true;
                        if (pendingPreview) {
                            showPreview(pendingPreview.data, pendingPreview.useLocal);
                            pendingPreview = null;
                        }
                    }, 100);
                };
                
                script.onerror = () => {
                    console.log('❌ 로컬 스크립트 로드 실패, CDN만 사용');
                    qdxReady = true;
                    if (pendingPreview) {
                        showPreview(pendingPreview.data, false);
                        pendingPreview = null;
                    }
                };
                
                document.head.appendChild(script);
                
            } catch (error) {
                console.error('❌ 로컬 QDX 로드 실패:', error);
                qdxReady = true;
            }
        }
        
        function showPreview(data, useLocal = false) {
            if (!data) {
                console.log('데이터 없음');
                return;
            }
            
            if (!qdxReady) {
                console.log('⏳ QDX 준비 중...');
                pendingPreview = { data, useLocal };
                return;
            }
            
            try {
                // 기존 팝업 제거
                const existingPopup = document.getElementById('qdx_popup_wrap');
                if (existingPopup) {
                    existingPopup.remove();
                }
                
                const qdxToUse = (useLocal && localQdx) ? localQdx : cdnQdx;
                const version = (useLocal && localQdx) ? '로컬 JS' : 'CDN';
                
                console.log(\`📱 미리보기 표시 (\${version}):, data\`);
                const messageId = 'PREVIEW_' + Date.now();
                qdxToUse.showMsg(messageId, data);
                
            } catch (error) {
                console.error('❌ 미리보기 실패:', error);
            }
        }
        
        window.addEventListener('message', function (e) {
            if (e.data.type === 'show_preview' && e.data.data) {
                console.log('📨 메시지 수신:', e.data.data);
                showPreview(e.data.data, e.data.useLocal);
            }
        });
        
        // 초기화 시작
        initQdx();
    </script>
</body>
</html>
                        `}
                        title="QDX Test"
                        sandbox="allow-scripts allow-same-origin"
                    />
                </PreviewSection>

            </ModuleWrapper>
        </div>
    );
};

export default InAppModule;
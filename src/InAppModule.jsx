import React, { useEffect, useRef, useState } from 'react';
import {
    ModuleWrapper, ContentSection, Header, HeaderIcon, StepTitle, StepNumber,
    ContentArea, NavigationArea, BackButton, NextButton, PreviewSection, 
    PreviewIframeContainer
} from './styles/StyledComponents';
import { BackIcon, NextIcon, DisplayIcon, ImageIcon } from './components/Icons';
import SelectionGridComponent from './components/SelectionGrid';
import { UnifiedSettings } from './components/UnifiedSettings';
import PreviewIframe from './components/PreviewIframe';
import PreviewControls from './components/PreviewControls';
import JsonModal from './components/JsonModal';
import { useInAppData, useInAppSelections } from './hooks/useInAppData';
import { getCurrentItems, getCurrentStepTitle, getCurrentStepNumber, isNextEnabled } from './utils/inAppUtils';
import { calculateTheme } from './utils/themeUtils';
import { InAppService } from './services/inAppService';
import { createDefaultPreviewData } from './config/appConfig';
import { generatePopupHTML } from './components/popupGenerator';

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
    const [showJsonModal, setShowJsonModal] = useState(false);

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

    // 초기 데이터 설정
    useEffect(() => {
        setInitialData(initialData);
    }, [initialData, loading]);

    // 미리보기 데이터 처리 (iframe 로딩 후에만 실행)
    useEffect(() => {
        if (currentStep === 1) {
            if (selections.displayType) {
                const baseData = createDefaultPreviewData(selections.displayType);
                
                // 보존된 설정이 있으면 적용
                if (preservedSettings && Object.keys(preservedSettings).some(key => preservedSettings[key])) {
                    const updatedData = applyPreservedSettings(baseData, preservedSettings, selections.displayType);
                    setPreviewData(updatedData);
                } else {
                    setPreviewData(baseData);
                }
            } else {
                setPreviewData(createDefaultPreviewData('BAR'));
            }
        }
    }, [selections.displayType, currentStep, preservedSettings]);

    // 미리보기 데이터 변경 시 iframe에 전송
    useEffect(() => {
        if (previewData && previewIframeRef.current) {
            previewIframeRef.current.postMessage({
                type: 'show_preview',
                data: previewData
            });
        }
    }, [previewData]);

    // 보존된 설정 적용
    const applyPreservedSettings = (baseData, preserved, displayType) => {
        const data = { ...baseData };
        
        // 이미지 설정
        if (preserved.imageEnabled) {
            if (displayType?.toUpperCase() === 'SLIDE' && preserved.images && preserved.images.length > 0) {
                // SLIDE 타입일 때 보존된 이미지들을 올바른 형식으로 변환
                data.images = preserved.images.map((img, index) => ({
                    seq: index + 1,
                    url: img.url || '',
                    action: img.action === 'link' ? 'L' : '',
                    linkUrl: img.linkUrl || '',
                    linkOpt: img.linkTarget === 'new' ? 'B' : 'S'
                }));
            } else if (preserved.imageUrl) {
                data.images = [{
                    seq: 1,
                    url: preserved.imageUrl,
                    action: preserved.clickAction === 'link' ? 'L' : '',
                    linkUrl: preserved.linkUrl || '',
                    linkOpt: preserved.linkTarget === 'new' ? 'B' : 'S'
                }];
            }
            if (!data.show.includes('images')) data.show.push('images');
        }

        // 텍스트 설정
        if (preserved.textEnabled) {
            data.msg = {
                title: preserved.titleContent || `${displayType?.toUpperCase()}형 미리보기`,
                text: preserved.bodyContent || "이것은 미리보기 내용입니다."
            };
            if (!data.show.includes('msg')) data.show.push('msg');
        }

        // 버튼 설정
        if (preserved.buttonEnabled && preserved.buttons && preserved.buttons.length > 0) {
            data.buttons = preserved.buttons.map((btn, index) => ({
                seq: index + 1,
                text: btn.text || '',
                linkUrl: btn.url || '',
                linkOpt: btn.target === 'new' ? 'B' : 'S'
            }));
            data.show.push(preserved.buttons.length >= 2 ? 'buttons2' : 'buttons');
        }

        return data;
    };

    // iframe 메시지 핸들러
    const handleIframeMessage = (e) => {
        if (e.data.type === 'generate_popup_html') {
            const html = generatePopupHTML(e.data.messageId, e.data.data);
            previewIframeRef.current?.postMessage({
                type: 'popup_html_generated',
                html: html
            });
        } else if (e.data.type === 'today_option_changed') {
            setPreviewData(prev => ({
                ...prev,
                today: e.data.checked ? 'Y' : 'N'
            }));
        } else if (e.data.type === 'iframe_ready') {
            // iframe이 로드 완료되면 초기 미리보기 데이터 전송
            if (!previewData && !loading) {
                const defaultData = createDefaultPreviewData("BAR");
                setPreviewData(defaultData);
                previewIframeRef.current?.postMessage({
                    type: 'show_preview',
                    data: defaultData
                });
            } else if (previewData) {
                previewIframeRef.current?.postMessage({
                    type: 'show_preview',
                    data: previewData
                });
            }
        }
    };

    // 설정 데이터 변경 처리
    const handleSettingsDataChange = (jsonData) => {
        const settings = settingsRef.current?.getSettingsData?.() || {};
        const buttons = settingsRef.current?.getButtonsData?.() || [];
        const themeInfo = calculateTheme(selections.displayType, settings, buttons);
        
        const validatedData = {
            ...jsonData,
            display: selections.displayType || 'BOX',
            code: themeInfo.code,
            cssClass: themeInfo.cssClass,
            show: themeInfo.show
        };

        setPreviewData(validatedData);
    };

    // JSON 형식 변환
    const convertToNewJsonFormat = () => {
        const settings = settingsRef.current?.getSettingsData?.() || {};
        const buttons = settingsRef.current?.getButtonsData?.() || [];
        const themeInfo = calculateTheme(selections.displayType, settings, buttons);

        return {
            display: selections.displayType || 'BOX',
            theme: themeInfo.theme,
            show: themeInfo.show,
            location: settings.location || 'TOP',
            images: settings.images || [],
            msg: settings.msg || {},
            today: previewData?.today || 'N',
            buttons: buttons
        };
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
            
            setPreservedSettings({
                ...currentSettings,
                buttons: currentButtons || []
            });
        }
        
        handleBack();
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
                            {currentStep === 1 ? <DisplayIcon /> : <ImageIcon />}
                        </HeaderIcon>
                        <div style={{ flex: 1 }}>
                            <StepTitle>
                                {getCurrentStepTitle(currentStep)}
                            </StepTitle>
                            {currentStep === 2 && (
                                <p style={{
                                    color: '#6b7280',
                                    fontSize: '12px',
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

                    <ContentArea>
                        {currentStep === 1 ? (
                            <SelectionGridComponent
                                items={getCurrentItems(currentStep, displayTypes, locations, selections)}
                                currentStep={currentStep}
                                selections={selections}
                                onItemSelect={handleItemSelect}
                            />
                        ) : (
                            <UnifiedSettings
                                ref={settingsRef}
                                displayType={selections.displayType}
                                onDataChange={handleSettingsDataChange}
                                onValidationChange={setIsValidForSave}
                                preservedSettings={preservedSettings}
                                onSettingsPreserve={setPreservedSettings}
                            />
                        )}
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
                    {(currentStep === 1 || currentStep === 2) && (
                        <PreviewControls
                            previewData={previewData}
                            onTodayToggle={() => setPreviewData(prev => ({
                                ...prev,
                                today: prev.today === 'Y' ? 'N' : 'Y'
                            }))}
                            onJsonView={() => setShowJsonModal(true)}
                            onLocationChange={(location) => setPreviewData(prev => ({
                                ...prev,
                                location
                            }))}
                        />
                    )}
                    
                    <PreviewIframeContainer>
                        <PreviewIframe
                            ref={previewIframeRef}
                            onMessage={handleIframeMessage}
                        />
                    </PreviewIframeContainer>
                </PreviewSection>
            </ModuleWrapper>

            <JsonModal
                show={showJsonModal}
                jsonData={currentStep === 2 && settingsRef.current ? convertToNewJsonFormat() : previewData}
                onClose={() => setShowJsonModal(false)}
                onCopy={() => setShowJsonModal(false)}
            />
        </div>
    );
};

export default InAppModule;
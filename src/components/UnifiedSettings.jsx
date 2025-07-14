// components/UnifiedSettings.jsx - 완전한 버전
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { validateSettings, clearFieldError } from '../utils/ValidationUtils';
import { getDisplayConfig, getActiveComponents, createInitialSettings, canToggleComponent } from '../config/displayTypeConfig';
import { generateInAppJsonData, validateJsonData } from '../utils/jsonDataGenerator';

// 분리된 설정 컴포넌트들
import { LocationSettings } from './settings/LocationSettings';
import { ImageSettings } from './settings/ImageSettings';
import { TextSettings } from './settings/TextSettings';
import { ButtonSettings } from './settings/ButtonSettings';

/**
 * 통합 설정 컴포넌트 - Next 버튼 클릭 시에만 검증
 */
export const UnifiedSettings = forwardRef(({ displayType, onDataChange, onValidationChange }, ref) => {
    console.log('🔧 UnifiedSettings - displayType:', displayType);

    // 표시형태별 설정 가져오기
    const displayConfig = getDisplayConfig(displayType);
    const activeComponents = getActiveComponents(displayType);

    // 표시형태별 초기 설정
    const initialSettings = createInitialSettings(displayType);

    // 상태 관리
    const [settings, setSettings] = useState({
        ...initialSettings,
        location: displayConfig.defaultLocation
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [urlValidation, setUrlValidation] = useState({
        imageUrl: false,
        linkUrl: false,
        buttons: {}
    });
    const [toast, setToast] = useState({ show: false, message: '' });
    const [buttons, setButtons] = useState([
        { id: 1, text: '', url: '', target: 'current' },
        { id: 2, text: '', url: '', target: 'current' }
    ]);

    // 검증 실행 여부 상태 추가
    const [hasValidationRun, setHasValidationRun] = useState(false);

    // 표시형태 변경 시 설정 재설정
    useEffect(() => {
        console.log('🔄 표시형태 변경:', displayType);
        const newInitialSettings = createInitialSettings(displayType);
        setSettings(prev => ({
            ...newInitialSettings,
            location: getDisplayConfig(displayType).defaultLocation,
            // 사용자가 입력한 내용은 유지
            titleContent: prev.titleContent,
            bodyContent: prev.bodyContent,
            imageUrl: prev.imageUrl,
            linkUrl: prev.linkUrl
        }));

        // 표시형태 변경 시 검증 상태 초기화
        setHasValidationRun(false);
        setValidationErrors({});
    }, [displayType]);

    // 토스트 표시
    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    // URL 검증 함수
    const checkUrlValidation = (url, field, buttonId = null) => {
        const isValid = url && /^https?:\/\/.+/.test(url);

        if (buttonId) {
            setUrlValidation(prev => ({
                ...prev,
                buttons: { ...prev.buttons, [buttonId]: isValid }
            }));
        } else {
            setUrlValidation(prev => ({ ...prev, [field]: isValid }));
        }

        return isValid;
    };

    // 이벤트 핸들러들
    const handleToggle = (type) => {
        setSettings(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const handleInputChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
        if (field === 'imageUrl' || field === 'linkUrl') {
            checkUrlValidation(value, field);
        }

        // 검증이 실행된 경우에만 에러 해제
        if (hasValidationRun) {
            setValidationErrors(prev => clearFieldError(prev, field));
        }
    };

    const handleRichTextChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));

        // 검증이 실행된 경우에만 에러 해제
        if (hasValidationRun) {
            setValidationErrors(prev => clearFieldError(prev, field));
        }
    };

    const handleRichTextClick = (field) => {
        // 검증이 실행된 경우에만 에러 해제
        if (hasValidationRun && validationErrors[field]) {
            setValidationErrors(prev => clearFieldError(prev, field));
        }
    };

    const updateButton = (buttonId, field, value) => {
        setButtons(prev => prev.map(btn =>
            btn.id === buttonId ? { ...btn, [field]: value } : btn
        ));

        if (field === 'url') {
            checkUrlValidation(value, 'url', buttonId);
        }

        // 검증이 실행된 경우에만 에러 해제
        if (hasValidationRun) {
            const errorKey = `button_${buttonId}_${field}`;
            setValidationErrors(prev => clearFieldError(prev, errorKey));
        }
    };

    // JSON 생성 및 검증
    const generateJsonData = () => {
        console.log('📊 사용자 입력 기반 JSON 생성');
        const jsonData = generateInAppJsonData(displayType, settings, buttons);
        const validation = validateJsonData(jsonData);

        if (!validation.isValid) {
            console.warn('⚠️ JSON 검증 경고:', validation.errors);
        }

        return jsonData;
    };

    const validate = () => {
        console.log('🔍 검증 로직 수행');
        setHasValidationRun(true); // 검증 실행됨을 표시

        const errors = validateSettings(settings, buttons);
        setValidationErrors(errors);

        const hasNoErrors = Object.keys(errors).length === 0;

        // URL 검증은 URL이 입력된 경우에만 확인
        let urlsValidated = true;

        // 이미지 URL 검증
        if (settings.imageEnabled && settings.imageUrl) {
            urlsValidated = urlsValidated && urlValidation.imageUrl;
        }

        // 링크 URL 검증
        if (settings.imageEnabled && settings.clickAction === 'link' && settings.linkUrl) {
            urlsValidated = urlsValidated && urlValidation.linkUrl;
        }

        // 버튼 URL 검증
        if (settings.buttonEnabled) {
            buttons.forEach(btn => {
                if (btn.url) {
                    urlsValidated = urlsValidated && urlValidation.buttons[btn.id];
                }
            });
        }

        const finalResult = hasNoErrors && urlsValidated;
        console.log('🔍 검증 결과:', { hasNoErrors, urlsValidated, finalResult });

        return finalResult;
    };

    // 데이터 변경 시 부모로 전달 (검증은 Next 버튼 눌렀을 때만)
    useEffect(() => {
        const jsonData = generateJsonData();

        // JSON 데이터는 항상 전달
        if (onDataChange) onDataChange(jsonData);

        // 검증은 실행된 경우에만 상태 전달
        if (hasValidationRun) {
            const isValid = validate();
            if (onValidationChange) onValidationChange(isValid);
        } else {
            // 아직 검증 안했으면 일단 true로 (Next 버튼 활성화)
            if (onValidationChange) onValidationChange(true);
        }
    }, [settings, buttons, urlValidation, hasValidationRun]);

    // 외부 호출용 함수
    useImperativeHandle(ref, () => ({
        validateSettings: validate,
        getJsonData: generateJsonData
    }));

    // 토글 가능 여부 계산
    const canToggleImage = canToggleComponent(displayType, 'image');
    const canToggleText = canToggleComponent(displayType, 'text');
    const canToggleButton = canToggleComponent(displayType, 'button');

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>

            {/* 위치 설정 */}
            <LocationSettings
                location={settings.location}
                onChange={(value) => handleInputChange('location', value)}
            />

            {/* 이미지 설정 */}
            {activeComponents.image && (
                <ImageSettings
                    settings={settings}
                    validationErrors={hasValidationRun ? validationErrors : {}} // 검증 실행 후에만 에러 표시
                    urlValidation={urlValidation}
                    displayType={displayType}
                    canToggle={canToggleImage}
                    onToggle={handleToggle}
                    onInputChange={handleInputChange}
                    onUrlValidation={checkUrlValidation}
                    showToast={showToast}
                />
            )}

            {/* 텍스트 설정 */}
            {activeComponents.text && (
                <TextSettings
                    settings={settings}
                    validationErrors={hasValidationRun ? validationErrors : {}} // 검증 실행 후에만 에러 표시
                    displayType={displayType}
                    canToggle={canToggleText}
                    onToggle={handleToggle}
                    onRichTextChange={handleRichTextChange}
                    onRichTextClick={handleRichTextClick}
                />
            )}

            {/* 버튼 설정 */}
            {activeComponents.button && (
                <ButtonSettings
                    settings={settings}
                    buttons={buttons}
                    validationErrors={hasValidationRun ? validationErrors : {}} // 검증 실행 후에만 에러 표시
                    urlValidation={urlValidation}
                    canToggle={canToggleButton}
                    onToggle={handleToggle}
                    onUpdateButton={updateButton}
                    onUrlValidation={checkUrlValidation}
                    showToast={showToast}
                />
            )}

            {/* 토스트 메시지 */}
            {toast.show && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: '#333',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    {toast.message}
                </div>
            )}
        </div>
    );
});
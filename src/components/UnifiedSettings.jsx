// components/UnifiedSettings.jsx - 완전한 버전 (수정됨)
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
export const UnifiedSettings = forwardRef(({ 
    displayType, 
    onDataChange, 
    onValidationChange, 
    preservedSettings = {}, 
    onSettingsPreserve 
}, ref) => {
    console.log('🔧 UnifiedSettings - displayType:', displayType);
    console.log('🔧 보존된 설정:', preservedSettings);

    // displayType이 null이면 아무것도 렌더링하지 않음
    if (!displayType) {
        return null;
    }

    // 표시형태별 설정 가져오기
    const displayConfig = getDisplayConfig(displayType);
    const activeComponents = getActiveComponents(displayType);

    // 표시형태별 초기 설정 (보존된 설정과 병합)
    const initialSettings = createInitialSettings(displayType);
    const mergedSettings = {
        ...initialSettings,
        ...preservedSettings, // 보존된 설정을 우선 적용
        location: displayConfig.defaultLocation // 위치는 새 디스플레이 타입의 기본값 사용
    };

    // 상태 관리
    const [settings, setSettings] = useState(mergedSettings);

    const [validationErrors, setValidationErrors] = useState({});
    const [urlValidation, setUrlValidation] = useState({
        imageUrl: false,
        linkUrl: false,
        buttons: {}
    });
    const [toast, setToast] = useState({ show: false, message: '' });

    // 버튼 개수를 동적으로 관리 (최대 2개)
    const [buttons, setButtons] = useState([]);
    const [nextButtonId, setNextButtonId] = useState(1);

    // 검증 실행 여부 상태 추가
    const [hasValidationRun, setHasValidationRun] = useState(false);

    // 표시형태 변경 시 설정 재설정
    useEffect(() => {
        console.log('🔄 표시형태 변경:', displayType);
        
        // 🔥 현재 설정을 보존 (표시형태가 바뀌기 전 설정 저장)
        if (onSettingsPreserve) {
            const currentSettings = {
                titleContent: settings.titleContent,
                bodyContent: settings.bodyContent,
                imageUrl: settings.imageUrl,
                linkUrl: settings.linkUrl,
                clickAction: settings.clickAction,
                linkTarget: settings.linkTarget,
                textEnabled: settings.textEnabled,
                imageEnabled: settings.imageEnabled,
                buttonEnabled: settings.buttonEnabled
            };
            onSettingsPreserve(currentSettings);
        }
        
        const newInitialSettings = createInitialSettings(displayType);
        const newMergedSettings = {
            ...newInitialSettings,
            ...preservedSettings, // 보존된 사용자 데이터 유지
            location: getDisplayConfig(displayType).defaultLocation // 새 타입의 기본 위치
        };
        
        console.log('🔄 새 설정:', newMergedSettings);
        setSettings(newMergedSettings);

        // 버튼 초기화 (보존된 버튼이 있다면 유지)
        if (preservedSettings.buttons && preservedSettings.buttons.length > 0) {
            setButtons(preservedSettings.buttons);
        } else {
            setButtons([]);
            setNextButtonId(1);
        }

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
        
        // 🔥 이미지 URL이 입력되면 자동으로 이미지 활성화
        if (field === 'imageUrl' && value && !settings.imageEnabled) {
            setSettings(prev => ({ ...prev, imageEnabled: true }));
        }
        
        // 🔥 URL 입력 시 자동 검증
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

    // 버튼 추가
    const addButton = () => {
        if (buttons.length < 2) {
            const newButton = {
                id: nextButtonId,
                text: '',
                url: '',
                target: 'current'
            };
            setButtons(prev => [...prev, newButton]);
            setNextButtonId(prev => prev + 1);
        }
    };

    // 버튼 삭제
    const removeButton = (buttonId) => {
        setButtons(prev => prev.filter(btn => btn.id !== buttonId));
        setUrlValidation(prev => {
            const newButtons = { ...prev.buttons };
            delete newButtons[buttonId];
            return { ...prev, buttons: newButtons };
        });

        // 검증 에러도 제거
        if (hasValidationRun) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                Object.keys(newErrors).forEach(key => {
                    if (key.startsWith(`button_${buttonId}_`)) {
                        delete newErrors[key];
                    }
                });
                return newErrors;
            });
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
        
        // 🔥 설정이 비활성화되어 있어도 기본 미리보기용 데이터는 유지
        if (!settings.textEnabled && (!jsonData.msg.title && !jsonData.msg.text)) {
            jsonData.msg = {
                title: `${displayType?.toUpperCase()}형 미리보기`,
                text: "이것은 미리보기 내용입니다."
            };
            // show 배열에 msg 추가 (미리보기용)
            if (!jsonData.show.includes('msg')) {
                jsonData.show.push('msg');
            }
        }
        
        // 🔥 텍스트가 활성화되어 있는데 제목이 비어있다면 기본 제목 추가
        if (settings.textEnabled && !jsonData.msg.title && jsonData.msg.text) {
            jsonData.msg.title = "제목을 입력하세요";
        }
        
        if (!settings.imageEnabled && (!jsonData.images || jsonData.images.length === 0)) {
            jsonData.images = [{
                seq: 1,
                url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhFjJgDxmK9CVk3XxTiitDyZLIOKJvtZNLrg&s",
                action: "",
                linkUrl: "",
                linkOpt: ""
            }];
            // show 배열에 images 추가 (미리보기용)
            if (!jsonData.show.includes('images')) {
                jsonData.show.push('images');
            }
        }
        
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
        console.log('📊 UnifiedSettings JSON 생성:', jsonData);

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
        getJsonData: generateJsonData,
        updateTodayOption: (checked) => {
            setSettings(prev => ({ ...prev, showTodayOption: checked }));
        },
        // 🔥 설정 데이터 제공 함수들 추가
        getSettingsData: () => settings,
        getButtonsData: () => buttons
    }));

    // 토글 가능 여부 계산
    const canToggleImage = canToggleComponent(displayType, 'image');
    const canToggleText = canToggleComponent(displayType, 'text');
    const canToggleButton = canToggleComponent(displayType, 'button');

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
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
                    onAddButton={addButton}
                    onRemoveButton={removeButton}
                    onUrlValidation={checkUrlValidation}
                    showToast={showToast}
                    maxButtons={2}
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
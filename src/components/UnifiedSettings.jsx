import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { validateSettings, clearFieldError, validateJsonData } from '../utils/ValidationUtils';
import { getDisplayConfig, getActiveComponents, createInitialSettings, canToggleComponent } from '../config/appConfig';
import { generateInAppJsonData } from '../utils/jsonDataGenerator';
import { LocationSettings } from './settings/LocationSettings';
import { ImageSettings } from './settings/ImageSettings';
import { TextSettings } from './settings/TextSettings';
import { ButtonSettings } from './settings/ButtonSettings';
import { commonStyles } from '../styles/commonStyles.jsx';

export const UnifiedSettings = forwardRef(({ 
    displayType, 
    onDataChange, 
    onValidationChange, 
    preservedSettings = {}, 
    onSettingsPreserve 
}, ref) => {
    if (!displayType) {
        return null;
    }

    const displayConfig = getDisplayConfig(displayType);
    const activeComponents = getActiveComponents(displayType);

    const initialSettings = createInitialSettings(displayType);
    const mergedSettings = {
        ...initialSettings,
        ...preservedSettings,
        location: displayConfig.defaultLocation
    };

    const [settings, setSettings] = useState(mergedSettings);
    const [validationErrors, setValidationErrors] = useState({});
    const [urlValidation, setUrlValidation] = useState({
        imageUrl: false,
        linkUrl: false,
        buttons: {},
        errors: {} // 에러 상태 추가
    });
    const [toast, setToast] = useState({ show: false, message: '', position: { top: 20, right: 20 } });
    const [hasUserInput, setHasUserInput] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);
    const [buttons, setButtons] = useState([]);
    const [nextButtonId, setNextButtonId] = useState(1);
    const [hasValidationRun, setHasValidationRun] = useState(false);

    const handleImagesChange = (images) => {
        setCurrentImages(images);
        if (images.length > 0 && images.some(img => img.url && img.url.trim())) {
            if (!hasUserInput) {
                setHasUserInput(true);
            }
        }
    };

    useEffect(() => {
        if (onSettingsPreserve && Object.keys(settings).length > 0) {
            const currentSettings = {
                titleContent: settings.titleContent,
                bodyContent: settings.bodyContent,
                imageUrl: settings.imageUrl,
                linkUrl: settings.linkUrl,
                clickAction: settings.clickAction,
                linkTarget: settings.linkTarget,
                textEnabled: settings.textEnabled,
                imageEnabled: settings.imageEnabled,
                buttonEnabled: settings.buttonEnabled,
                images: currentImages.length > 0 ? currentImages : settings.images
            };
            onSettingsPreserve(currentSettings);
        }
        
        const newInitialSettings = createInitialSettings(displayType);
        const newMergedSettings = {
            ...newInitialSettings,
            ...preservedSettings,
            location: getDisplayConfig(displayType).defaultLocation
        };
        
        setSettings(newMergedSettings);

        if (preservedSettings.buttons && preservedSettings.buttons.length > 0) {
            setButtons(preservedSettings.buttons);
            // 🔥 보존된 버튼들의 최대 ID + 1로 nextButtonId 설정
            const maxId = Math.max(...preservedSettings.buttons.map(btn => btn.id));
            setNextButtonId(maxId + 1);
        } else {
            setButtons([]);
            setNextButtonId(1);
        }

        if (preservedSettings.images && Array.isArray(preservedSettings.images)) {
            setCurrentImages(preservedSettings.images);
        } else {
            setCurrentImages([]);
        }

        const hasPreservedInput = preservedSettings.titleContent || 
                                preservedSettings.bodyContent || 
                                preservedSettings.imageUrl || 
                                (preservedSettings.images && preservedSettings.images.length > 0) ||
                                (preservedSettings.buttons && preservedSettings.buttons.length > 0);
        setHasUserInput(hasPreservedInput);

        setHasValidationRun(false);
        setValidationErrors({});
    }, [displayType]);

    const clearUrlError = (field, buttonId = null) => {
        if (buttonId) {
            setUrlValidation(prev => ({
                ...prev,
                errors: { ...prev.errors, [`button_${buttonId}_url`]: false }
            }));
        } else {
            setUrlValidation(prev => ({
                ...prev,
                errors: { ...prev.errors, [field]: false }
            }));
        }
    };

    const showToast = (message, event = null) => {
        let position = { top: 20, right: 20, fixed: false }; // 기본 위치
        
        if (event && event.target) {
            const buttonRect = event.target.getBoundingClientRect();
            
            // 뷰포트 기준으로 위치 계산 (fixed 포지셔닝)
            position = {
                top: Math.max(10, buttonRect.top - 60), // 버튼 위 60px, 최소 10px
                left: Math.max(10, buttonRect.left - 50), // 버튼보다 약간 왼쪽
                right: 'auto',
                fixed: true // fixed 포지셔닝 사용
            };
            
            // 화면 오른쪽 밖으로 나가지 않도록 조정
            const maxLeft = window.innerWidth - 250;
            if (position.left > maxLeft) {
                position.left = maxLeft;
            }
            
            // 화면 위쪽 밖으로 나가지 않도록 조정
            if (position.top < 10) {
                position.top = buttonRect.bottom + 10; // 버튼 아래로 표시
            }
        }
        
        setToast({ show: true, message, position });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const checkUrlValidation = (url, field, buttonId = null) => {
        // 빈 URL은 검증하지 않음
        if (!url || !url.trim()) {
            if (buttonId) {
                setUrlValidation(prev => ({
                    ...prev,
                    buttons: { ...prev.buttons, [buttonId]: false },
                    errors: { ...prev.errors, [`button_${buttonId}_url`]: false }
                }));
            } else {
                setUrlValidation(prev => ({ 
                    ...prev, 
                    [field]: false,
                    errors: { ...prev.errors, [field]: false }
                }));
            }
            return false;
        }

        // URL 검증 로직
        let isValid = false;
        
        try {
            // 1. 기본 http/https 형식 검증
            const httpRegex = /^https?:\/\/.+/;
            if (httpRegex.test(url)) {
                // 2. URL 객체로 파싱 가능한지 확인
                new URL(url);
                isValid = true;
            }
        } catch (e) {
            isValid = false;
        }

        // 3. 추가 검증 규칙
        if (isValid) {
            // 도메인 부분 확인
            const domainMatch = url.match(/^https?:\/\/([^\/]+)/);
            if (domainMatch) {
                const domain = domainMatch[1];
                // 유효한 도메인 형식인지 확인 (최소한 점이 있어야 함)
                if (!domain.includes('.') || domain.endsWith('.') || domain.startsWith('.')) {
                    isValid = false;
                }
            } else {
                isValid = false;
            }
        }

        if (buttonId) {
            setUrlValidation(prev => ({
                ...prev,
                buttons: { ...prev.buttons, [buttonId]: isValid },
                errors: { ...prev.errors, [`button_${buttonId}_url`]: !isValid }
            }));
        } else {
            setUrlValidation(prev => ({ 
                ...prev, 
                [field]: isValid,
                errors: { ...prev.errors, [field]: !isValid }
            }));
        }

        return isValid;
    };

    const handleToggle = (type) => {
        setSettings(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const handleInputChange = (field, value) => {
        // clearUrlError 처리
        if (field === 'clearUrlError' && value?.field) {
            setUrlValidation(prev => ({
                ...prev,
                errors: { ...prev.errors, [value.field]: false }
            }));
            return;
        }

        setSettings(prev => ({ ...prev, [field]: value }));
        
        // URL 에러 상태 지우기
        if (field === 'imageUrl' || field === 'linkUrl') {
            clearUrlError(field);
        }
        
        if (field === 'images' && Array.isArray(value)) {
            if (value.length > 0 && value.some(img => img.url && img.url.trim()) && !hasUserInput) {
                setHasUserInput(true);
            }
        } else if (value && typeof value === 'string' && value.trim() && !hasUserInput) {
            setHasUserInput(true);
        }
        
        if (field === 'images' && displayType?.toUpperCase() === 'SLIDE') {
            setCurrentImages(value);
            const firstImage = value && value.length > 0 ? value[0] : null;
            if (firstImage) {
                setSettings(prev => ({ 
                    ...prev, 
                    [field]: value,
                    imageUrl: firstImage.url,
                    clickAction: firstImage.action,
                    linkUrl: firstImage.linkUrl,
                    linkTarget: firstImage.linkTarget
                }));
            } else {
                setSettings(prev => ({ 
                    ...prev, 
                    [field]: value,
                    imageUrl: '',
                    clickAction: '',
                    linkUrl: '',
                    linkTarget: 'current'
                }));
            }
            return;
        }
        
        if (field === 'imageUrl' && value && !settings.imageEnabled) {
            setSettings(prev => ({ ...prev, imageEnabled: true }));
        }
        
        if (field === 'imageUrl' || field === 'linkUrl') {
            checkUrlValidation(value, field);
        }

        if (hasValidationRun) {
            setValidationErrors(prev => clearFieldError(prev, field));
        }
    };

    const handleRichTextChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));

        if (value && typeof value === 'string') {
            const textOnly = value.replace(/<[^>]*>/g, '').trim();
            if (textOnly && !hasUserInput) {
                setHasUserInput(true);
            }
        }

        if (hasValidationRun) {
            setValidationErrors(prev => clearFieldError(prev, field));
        }
    };

    const handleRichTextClick = (field) => {
        if (hasValidationRun && validationErrors[field]) {
            setValidationErrors(prev => clearFieldError(prev, field));
        }
    };

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
            
            // 🔥 디버깅: 버튼 추가 로그
            console.log('🔘 새 버튼 추가:', newButton);
            console.log('🔘 현재 버튼 배열:', [...buttons, newButton]);
        }
    };

    const removeButton = (buttonId) => {
        setButtons(prev => prev.filter(btn => btn.id !== buttonId));
        setUrlValidation(prev => {
            const newButtons = { ...prev.buttons };
            delete newButtons[buttonId];
            return { ...prev, buttons: newButtons };
        });

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
        console.log('🔘 버튼 업데이트:', { buttonId, field, value });
        
        setButtons(prev => {
            const updated = prev.map(btn =>
                btn.id === buttonId ? { ...btn, [field]: value } : btn
            );
            console.log('🔘 업데이트된 버튼 배열:', updated);
            return updated;
        });

        // URL 에러 상태 지우기
        if (field === 'url') {
            clearUrlError('url', buttonId);
        }

        if (value && typeof value === 'string' && value.trim() && !hasUserInput) {
            setHasUserInput(true);
        }

        if (field === 'url') {
            checkUrlValidation(value, 'url', buttonId);
        }

        if (hasValidationRun) {
            const errorKey = `button_${buttonId}_${field}`;
            setValidationErrors(prev => clearFieldError(prev, errorKey));
        }
    };

    const generateJsonData = () => {
        const finalSettings = { ...settings };
        if (displayType?.toUpperCase() === 'SLIDE' && currentImages.length > 0) {
            finalSettings.images = currentImages;
        }
        
        const jsonData = generateInAppJsonData(displayType, finalSettings, buttons);
        
        if (!hasUserInput) {
            if (settings.imageEnabled && (!jsonData.images || jsonData.images.length === 0 || !jsonData.images.some(img => img.url && img.url.trim()))) {
                jsonData.images = [{
                    seq: 1,
                    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhFjJgDxmK9CVk3XxTiitDyZLIOKJvtZNLrg&s",
                    action: "",
                    linkUrl: "",
                    linkOpt: ""
                }];
                if (!jsonData.show.includes('images')) {
                    jsonData.show.push('images');
                }
            }
            
            if (settings.textEnabled && (!jsonData.msg.title && !jsonData.msg.text)) {
                jsonData.msg = {
                    title: `${displayType?.toUpperCase()}형 미리보기`,
                    text: "이것은 미리보기 내용입니다."
                };
                if (!jsonData.show.includes('msg')) {
                    jsonData.show.push('msg');
                }
            }
            
            if (settings.buttonEnabled && (!jsonData.buttons || jsonData.buttons.length === 0 || !jsonData.buttons.some(btn => btn.text && btn.text.trim()))) {
                jsonData.buttons = [{
                    seq: 1,
                    text: "버튼 예시",
                    linkUrl: "https://www.example.com",
                    linkOpt: "S"
                }];
                if (!jsonData.show.includes('buttons')) {
                    jsonData.show.push('buttons');
                }
            }
            
            if (!settings.imageEnabled) {
                jsonData.images = [];
                jsonData.show = jsonData.show.filter(item => item !== 'images');
            }
            
            if (!settings.textEnabled) {
                jsonData.msg = {};
                jsonData.show = jsonData.show.filter(item => item !== 'msg');
            }
            
            if (!settings.buttonEnabled) {
                jsonData.buttons = [];
                jsonData.show = jsonData.show.filter(item => !item.includes('button'));
            }
            
            if (!settings.imageEnabled && !settings.textEnabled && !settings.buttonEnabled) {
                jsonData.msg = {
                    title: `${displayType?.toUpperCase()}형 미리보기`,
                    text: "이것은 미리보기 내용입니다."
                };
                jsonData.images = [{
                    seq: 1,
                    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhFjJgDxmK9CVk3XxTiitDyZLIOKJvtZNLrg&s",
                    action: "",
                    linkUrl: "",
                    linkOpt: ""
                }];
                jsonData.show = ['images', 'msg'];
            }
        }
        
        const validation = validateJsonData(jsonData);
        if (!validation.isValid) {
            console.warn('⚠️ JSON 검증 경고:', validation.errors);
        }

        return jsonData;
    };

    const validate = () => {
        setHasValidationRun(true);

        const errors = validateSettings(settings, buttons);
        setValidationErrors(errors);

        const hasNoErrors = Object.keys(errors).length === 0;

        let urlsValidated = true;

        if (settings.imageEnabled && settings.imageUrl) {
            urlsValidated = urlsValidated && urlValidation.imageUrl;
        }

        if (settings.imageEnabled && settings.clickAction === 'link' && settings.linkUrl) {
            urlsValidated = urlsValidated && urlValidation.linkUrl;
        }

        if (settings.buttonEnabled) {
            buttons.forEach(btn => {
                if (btn.url) {
                    urlsValidated = urlsValidated && urlValidation.buttons[btn.id];
                }
            });
        }

        return hasNoErrors && urlsValidated;
    };

    useEffect(() => {
        const jsonData = generateJsonData();

        if (onDataChange) onDataChange(jsonData);

        if (hasValidationRun) {
            const isValid = validate();
            if (onValidationChange) onValidationChange(isValid);
        } else {
            if (onValidationChange) onValidationChange(true);
        }
    }, [settings, buttons, urlValidation, hasValidationRun]);

    useImperativeHandle(ref, () => ({
        validateSettings: validate,
        getJsonData: generateJsonData,
        updateTodayOption: (checked) => {
            setSettings(prev => ({ ...prev, showTodayOption: checked }));
        },
        getSettingsData: () => {
            const settingsData = { ...settings };
            if (displayType?.toUpperCase() === 'SLIDE' && currentImages.length > 0) {
                settingsData.images = currentImages;
            }
            return settingsData;
        },
        getButtonsData: () => buttons
    }));

    const canToggleImage = canToggleComponent(displayType, 'image');
    const canToggleText = canToggleComponent(displayType, 'text');
    const canToggleButton = canToggleComponent(displayType, 'button');

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            {activeComponents.image && (
                <ImageSettings
                    settings={settings}
                    validationErrors={hasValidationRun ? validationErrors : {}}
                    urlValidation={urlValidation}
                    displayType={displayType}
                    canToggle={canToggleImage}
                    onToggle={handleToggle}
                    onInputChange={handleInputChange}
                    onUrlValidation={checkUrlValidation}
                    showToast={showToast}
                    onImagesChange={handleImagesChange}
                />
            )}

            {activeComponents.text && (
                <TextSettings
                    settings={settings}
                    validationErrors={hasValidationRun ? validationErrors : {}}
                    displayType={displayType}
                    canToggle={canToggleText}
                    onToggle={handleToggle}
                    onRichTextChange={handleRichTextChange}
                    onRichTextClick={handleRichTextClick}
                />
            )}

            {activeComponents.button && (
                <ButtonSettings
                    settings={settings}
                    buttons={buttons}
                    validationErrors={hasValidationRun ? validationErrors : {}}
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

            {toast.show && (
                <div style={{
                    ...commonStyles.toast.base,
                    position: toast.position.fixed ? 'fixed' : 'absolute',
                    top: toast.position.top + 'px',
                    left: toast.position.left !== undefined ? toast.position.left + 'px' : 'auto',
                    right: toast.position.right !== 'auto' ? toast.position.right + 'px' : 'auto'
                }}>
                    {toast.message}
                    {/* 말풍선 꼬리 */}
                    <div style={commonStyles.toast.arrow} />
                </div>
            )}
        </div>
    );
});
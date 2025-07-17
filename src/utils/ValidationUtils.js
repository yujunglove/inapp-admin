// URL 관련 검증
export const URL_REGEX = /^https?:\/\/.+/i;

export const isValidUrl = (url) => {
    if (!url || typeof url !== 'string') return false;

    if (!URL_REGEX.test(url)) return false;

    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
};

// 텍스트 관련 검증
export const isRichTextEmpty = (content) => {
    if (!content) return true;

    const textOnly = content.replace(/<[^>]*>/g, '').trim();

    if (!textOnly || textOnly === '') return true;

    const cleanText = textOnly.replace(/&nbsp;/g, '').replace(/\s/g, '');

    return cleanText === '';
};

export const stripHtmlTags = (html) => {
    if (!html) return '';
    
    if (typeof document !== 'undefined') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    }
    
    return html.replace(/<[^>]*>/g, '').trim();
};

// 설정 검증
export const validateSettings = (settings, buttons) => {
    const errors = {};

    if (settings.imageEnabled) {
        // SLIDE 타입 이미지 검증
        if (settings.images && Array.isArray(settings.images)) {
            settings.images.forEach((img, index) => {
                if (!img.url || !img.url.trim()) {
                    errors[`image_${img.id}_url`] = true;
                }
                if (img.action === 'link' && (!img.linkUrl || !img.linkUrl.trim())) {
                    errors[`image_${img.id}_linkUrl`] = true;
                }
            });
        } else {
            // 일반 이미지 검증
            if (!settings.imageUrl || !settings.imageUrl.trim()) {
                errors.imageUrl = true;
            }
            if (settings.clickAction === 'link') {
                if (!settings.linkUrl || !settings.linkUrl.trim()) {
                    errors.linkUrl = true;
                }
            }
        }
    }

    if (settings.textEnabled) {
        if (isRichTextEmpty(settings.titleContent)) {
            errors.titleContent = true;
        }

        if (settings.bodyRequired && isRichTextEmpty(settings.bodyContent)) {
            errors.bodyContent = true;
        }
    }

    if (settings.buttonEnabled) {
        buttons.forEach(button => {
            if (!button.text || !button.text.trim()) {
                errors[`button_${button.id}_text`] = true;
            }
            if (!button.url || !button.url.trim()) {
                errors[`button_${button.id}_url`] = true;
            }
        });
    }

    return errors;
};

// JSON 데이터 검증
export const validateJsonData = (jsonData) => {
    const errors = [];

    if (!jsonData.display) {
        errors.push('표시형태(display)가 없습니다.');
    }

    if (!Array.isArray(jsonData.show)) {
        errors.push('표시 항목(show)이 배열이 아닙니다.');
    }

    if (jsonData.show?.includes('images')) {
        if (!Array.isArray(jsonData.images) || jsonData.images.length === 0) {
            errors.push('이미지가 활성화되었지만 이미지 데이터가 없습니다.');
        } else {
            jsonData.images.forEach((img, index) => {
                if (!img.url) {
                    errors.push(`이미지 ${index + 1}의 URL이 없습니다.`);
                }
            });
        }
    }

    if (jsonData.show?.includes('msg')) {
        if (!jsonData.msg || (typeof jsonData.msg !== 'object')) {
            errors.push('메시지가 활성화되었지만 메시지 데이터가 없습니다.');
        }
    }

    if (jsonData.show?.includes('buttons') || jsonData.show?.includes('buttons2')) {
        if (!Array.isArray(jsonData.buttons) || jsonData.buttons.length === 0) {
            errors.push('버튼이 활성화되었지만 버튼 데이터가 없습니다.');
        } else {
            jsonData.buttons.forEach((btn, index) => {
                if (!btn.text) {
                    errors.push(`버튼 ${index + 1}의 텍스트가 없습니다.`);
                }
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// URL 검증 핸들러
export const handleUrlCheck = (url, showToast) => {
    if (!url.trim()) {
        showToast('URL을 입력해주세요.');
        return false;
    }

    if (isValidUrl(url)) {
        showToast('✅ URL 검사 완료');
        return true;
    } else {
        showToast('❌ 올바른 URL 형식이 아닙니다.');
        return false;
    }
};

// 유틸리티 함수들
export const clearFieldError = (validationErrors, field) => {
    if (validationErrors[field]) {
        const newErrors = { ...validationErrors };
        delete newErrors[field];
        return newErrors;
    }
    return validationErrors;
};

export const createDebouncedValidator = (validateFn, delay = 500) => {
    let timeoutId;

    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            validateFn(...args);
        }, delay);
    };
};

// 이미지 URL 검증
export const validateImageUrl = (url) => {
    if (!url) return { isValid: false, error: 'URL을 입력해주세요.' };
    
    if (!isValidUrl(url)) {
        return { isValid: false, error: '올바른 URL 형식이 아닙니다.' };
    }

    // 이미지 확장자 검증 (선택적)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => url.toLowerCase().includes(ext));
    
    if (!hasImageExtension) {
        // 확장자가 없어도 허용하지만 경고
        return { isValid: true, warning: '이미지 파일이 아닐 수 있습니다.' };
    }

    return { isValid: true };
};

// 버튼 텍스트 검증
export const validateButtonText = (text) => {
    if (!text || !text.trim()) {
        return { isValid: false, error: '버튼 텍스트를 입력해주세요.' };
    }

    if (text.length > 20) {
        return { isValid: false, error: '버튼 텍스트는 20자 이하로 입력해주세요.' };
    }

    return { isValid: true };
};

// 제목/본문 검증
export const validateTextContent = (content, isTitle = false) => {
    const stripped = stripHtmlTags(content);
    
    if (!stripped) {
        return { isValid: false, error: `${isTitle ? '제목' : '본문'}을 입력해주세요.` };
    }

    if (isTitle && stripped.length > 50) {
        return { isValid: false, error: '제목은 50자 이하로 입력해주세요.' };
    }

    if (!isTitle && stripped.length > 200) {
        return { isValid: false, error: '본문은 200자 이하로 입력해주세요.' };
    }

    return { isValid: true };
};
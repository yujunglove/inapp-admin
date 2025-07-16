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

export const isRichTextEmpty = (content) => {
    if (!content) return true;

    const textOnly = content.replace(/<[^>]*>/g, '').trim();

    if (!textOnly || textOnly === '') return true;

    const cleanText = textOnly.replace(/&nbsp;/g, '').replace(/\s/g, '');

    return cleanText === '';
};

export const validateSettings = (settings, buttons) => {
    const errors = {};

    if (settings.imageEnabled) {
        if (!settings.imageUrl || !settings.imageUrl.trim()) {
            errors.imageUrl = true;
        }

        if (settings.clickAction === 'link') {
            if (!settings.linkUrl || !settings.linkUrl.trim()) {
                errors.linkUrl = true;
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
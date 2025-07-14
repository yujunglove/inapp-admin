// utils/ValidationUtils.js - 리치텍스트 전용 검증

/**
 * URL 유효성 검사 정규식
 */
export const URL_REGEX = /^(https?:\/\/|www\.)([a-z0-9-\w]+\.)*[a-z0-9-]{1,}([\/a-z0-9-%#?&=\w\-]*)*(\.[\/a-z0-9-]{0,50}(\?[\/a-z0-9-%#?&=\w]+)*)*$/i;

/**
 * URL 유효성 검사 함수
 */
export const isValidUrl = (url) => {
    return URL_REGEX.test(url);
};

/**
 * 리치텍스트 내용 검증 함수
 */
export const isRichTextEmpty = (content) => {
    if (!content) return true;

    // HTML 태그 제거
    const textOnly = content.replace(/<[^>]*>/g, '').trim();

    // 빈 문자열이거나 공백만 있는 경우
    if (!textOnly || textOnly === '') return true;

    // &nbsp; 등의 HTML 엔티티도 제거
    const cleanText = textOnly.replace(/&nbsp;/g, '').replace(/\s/g, '');

    return cleanText === '';
};

/**
 * 설정 검증 함수 - 리치텍스트 검증 개선
 */
export const validateSettings = (settings, buttons) => {
    const errors = {};

    console.log('🔍 검증 시작:', { settings, buttons });

    // 이미지 설정 검증
    if (settings.imageEnabled) {
        console.log('📷 이미지 검증 중...');

        if (!settings.imageUrl || !settings.imageUrl.trim()) {
            console.log('❌ 이미지 URL 비어있음');
            errors.imageUrl = true;
        }

        if (settings.clickAction === 'link') {
            if (!settings.linkUrl || !settings.linkUrl.trim()) {
                console.log('❌ 링크 URL 비어있음');
                errors.linkUrl = true;
            }
        }
    } else {
        console.log('📷 이미지 비활성화됨 - 건너뜀');
    }

    // 텍스트 설정 검증 - 리치텍스트 전용 검증
    if (settings.textEnabled) {
        console.log('📝 텍스트 검증 중...');
        console.log('📝 제목 내용:', settings.titleContent);

        if (isRichTextEmpty(settings.titleContent)) {
            console.log('❌ 제목 내용 비어있음');
            errors.titleContent = true;
        } else {
            console.log('✅ 제목 내용 있음');
        }

        // 본문이 필요한 경우 (선택사항)
        if (settings.bodyRequired && isRichTextEmpty(settings.bodyContent)) {
            console.log('❌ 본문 내용 비어있음');
            errors.bodyContent = true;
        }
    } else {
        console.log('📝 텍스트 비활성화됨 - 건너뜀');
    }

    // 버튼 설정 검증
    if (settings.buttonEnabled) {
        console.log('🔘 버튼 검증 중...');

        buttons.forEach(button => {
            if (!button.text || !button.text.trim()) {
                console.log(`❌ 버튼 ${button.id} 텍스트 비어있음`);
                errors[`button_${button.id}_text`] = true;
            }
            if (!button.url || !button.url.trim()) {
                console.log(`❌ 버튼 ${button.id} URL 비어있음`);
                errors[`button_${button.id}_url`] = true;
            }
        });
    } else {
        console.log('🔘 버튼 비활성화됨 - 건너뜀');
    }

    console.log('🔍 검증 결과:', errors);
    console.log('✅ 검증 성공:', Object.keys(errors).length === 0);

    return errors;
};

/**
 * URL 검증 함수
 */
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

/**
 * 에러 해제 함수
 */
export const clearFieldError = (validationErrors, field) => {
    if (validationErrors[field]) {
        const newErrors = { ...validationErrors };
        delete newErrors[field];
        return newErrors;
    }
    return validationErrors;
};

/**
 * 실시간 검증 함수 (디바운스 적용)
 */
export const createDebouncedValidator = (validateFn, delay = 500) => {
    let timeoutId;

    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            validateFn(...args);
        }, delay);
    };
};
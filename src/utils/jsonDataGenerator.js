import { getDisplayConfig } from '../config/displayTypeConfig';

// HTML 태그 제거 함수 (서버용 - 순수 텍스트만)
function stripHtmlTags(html) {
    if (!html) return '';
    
    // 브라우저 환경에서만 DOM 사용
    if (typeof document !== 'undefined') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    }
    
    // Node.js 환경이거나 document가 없는 경우 정규식 사용
    return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * 새로운 형식의 InApp JSON 데이터 생성
 * @param {string} displayType - 표시형태
 * @param {Object} settings - 설정 객체
 * @param {Array} buttons - 버튼 배열
 * @returns {Object} JSON 데이터
 */
export const generateInAppJsonData = (displayType, settings, buttons = []) => {
    // displayType이 null이면 기본값 사용
    if (!displayType) {
        console.warn('⚠️ displayType이 null입니다. 기본값 BOX 사용');
        displayType = 'BOX';
    }
    
    const config = getDisplayConfig(displayType);

    // show 배열 생성 - 활성화된 컴포넌트만 포함
    const show = [];

    if (settings.imageEnabled && config.image) {
        show.push('images');
    }

    if (settings.textEnabled && config.text) {
        show.push('msg');
    }

    if (settings.buttonEnabled && config.button && buttons.some(btn => btn.text.trim())) {
        show.push('buttons');
    }

    // 기본 데이터 구조
    const jsonData = {
        display: displayType.toUpperCase(),
        show: show,
        location: settings.location || config.defaultLocation || 'TOP'
    };

    // 이미지 데이터 - 허용되는 경우에만 추가
    if (config.image) {
        if (settings.imageEnabled) {
            if (displayType.toUpperCase() === 'SLIDE' && settings.images && Array.isArray(settings.images)) {
                // 슬라이드 타입: 여러 이미지 지원
                jsonData.images = settings.images
                    .filter(img => img.url && img.url.trim())
                    .map((img, index) => ({
                        seq: index + 1,
                        url: img.url,
                        action: img.action === 'link' ? 'L' : '',
                        linkUrl: img.action === 'link' ? (img.linkUrl || '') : '',
                        linkOpt: img.linkTarget === 'new' ? 'B' : 'S'
                    }));
            } else if (settings.imageUrl) {
                // 기존 타입: 단일 이미지
                jsonData.images = [{
                    seq: 1,
                    url: settings.imageUrl,
                    action: settings.clickAction === 'link' ? 'L' : '',
                    linkUrl: settings.clickAction === 'link' ? (settings.linkUrl || '') : '',
                    linkOpt: settings.linkTarget === 'new' ? 'B' : 'S'
                }];
            } else {
                jsonData.images = [];
            }
        } else {
            jsonData.images = [];
        }
    } else {
        // 🔥 이미지를 지원하지 않는 타입은 빈 배열
        jsonData.images = [];
    }

    // 메시지 데이터 - 허용되는 경우에만 추가
    if (config.text) {
        if (settings.textEnabled) {
            jsonData.msg = {
                title: stripHtmlTags(settings.titleContent || ''),
                text: stripHtmlTags(settings.bodyContent || '')
            };
        } else {
            jsonData.msg = {};
        }
    } else {
        // 🔥 텍스트를 지원하지 않는 타입은 빈 객체
        jsonData.msg = {};
    }

    // 오늘하루 보지않기
    jsonData.today = settings.showTodayOption ? 'Y' : 'N';

    // 버튼 데이터 - 허용되는 경우에만 추가
    if (config.button) {
        if (settings.buttonEnabled) {
            jsonData.buttons = buttons
                .filter(btn => btn.text && btn.text.trim())
                .map((btn, index) => ({
                    seq: index + 1,
                    text: btn.text,
                    linkUrl: btn.url || '',
                    linkOpt: btn.target === 'new' ? 'B' : 'S'
                }));
        } else {
            jsonData.buttons = [];
        }
    } else {
        // 🔥 버튼을 지원하지 않는 타입은 빈 배열
        jsonData.buttons = [];
    }

    return jsonData;
};

/**
 * JSON 데이터 검증
 * @param {Object} jsonData - 검증할 JSON 데이터
 * @returns {Object} {isValid: boolean, errors: Array}
 */
export const validateJsonData = (jsonData) => {
    const errors = [];

    // 필수 필드 검증
    if (!jsonData.display) {
        errors.push('표시형태(display)가 없습니다.');
    }

    if (!Array.isArray(jsonData.show)) {
        errors.push('표시 항목(show)이 배열이 아닙니다.');
    }

    // 이미지 검증
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

    // 메시지 검증
    if (jsonData.show?.includes('msg')) {
        if (!jsonData.msg || (typeof jsonData.msg !== 'object')) {
            errors.push('메시지가 활성화되었지만 메시지 데이터가 없습니다.');
        }
    }

    // 버튼 검증
    if (jsonData.show?.includes('buttons')) {
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
import { getThemeTemplate, getActiveComponents } from '../config/displayTypeConfig';

/**
 * HTML 태그 제거 함수
 * @param {string} html - HTML 문자열
 * @returns {string} 태그가 제거된 순수 텍스트
 */
export const stripHtmlTags = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
};

/**
 * 안전한 문자열 변환
 * @param {any} value - 변환할 값
 * @returns {string} 안전한 문자열
 */
export const safeString = (value) => {
    if (value === null || value === undefined) return '';
    return String(value).trim();
};

/**
 * 이미지 데이터 생성
 * @param {Object} settings - 설정 객체
 * @param {boolean} isEnabled - 이미지 활성화 여부
 * @returns {Array} 이미지 배열
 */
export const generateImagesData = (settings, isEnabled) => {
    if (!isEnabled) return [];

    return [{
        seq: 1,
        url: safeString(settings.imageUrl) || '',
        action: settings.clickAction === 'link' ? 'L' : '',
        linkUrl: settings.clickAction === 'link' ? safeString(settings.linkUrl) : '',
        linkOpt: settings.clickAction === 'link' && settings.linkTarget === 'new' ? 'B' : ''
    }];
};

/**
 * 텍스트 데이터 생성
 * @param {Object} settings - 설정 객체
 * @param {boolean} isEnabled - 텍스트 활성화 여부
 * @returns {Object} 메시지 객체
 */
export const generateMessageData = (settings, isEnabled) => {
    if (!isEnabled) return {};

    return {
        title: stripHtmlTags(settings.titleContent) || '',
        text: stripHtmlTags(settings.bodyContent) || ''
    };
};

/**
 * 버튼 데이터 생성
 * @param {Array} buttons - 버튼 배열
 * @param {boolean} isEnabled - 버튼 활성화 여부
 * @returns {Array} 버튼 배열
 */
export const generateButtonsData = (buttons, isEnabled) => {
    if (!isEnabled) return [];

    return buttons
        .filter(btn => btn.text && btn.text.trim() && btn.url && btn.url.trim())
        .map((btn, index) => ({
            seq: index + 1,
            text: safeString(btn.text),
            linkUrl: safeString(btn.url),
            linkOpt: btn.target === 'new' ? 'B' : ''
        }));
};

/**
 * show 배열 생성
 * @param {Object} settings - 설정 객체
 * @param {Object} activeComponents - 활성화된 컴포넌트
 * @returns {Array} show 배열
 */
export const generateShowArray = (settings, activeComponents) => {
    const showArray = [];

    if (settings.imageEnabled && activeComponents.image) {
        showArray.push('images');
    }

    if (settings.textEnabled && activeComponents.text) {
        showArray.push('msg');
    }

    if (settings.buttonEnabled && activeComponents.button) {
        showArray.push('buttons');
    }

    return showArray;
};

/**
 * 메인 JSON 데이터 생성 함수
 * @param {string} displayType - 표시형태
 * @param {Object} settings - 설정 객체
 * @param {Array} buttons - 버튼 배열
 * @returns {Object} QDX 호환 JSON 데이터
 */
export const generateInAppJsonData = (displayType, settings, buttons) => {
    console.log('📊 JSON 생성 시작:', { displayType, settings, buttons });

    try {
        // 표시형태별 설정 가져오기
        const { theme, template } = getThemeTemplate(displayType);
        const activeComponents = getActiveComponents(displayType);

        console.log('🎨 테마/템플릿:', { theme, template });
        console.log('🔧 활성 컴포넌트:', activeComponents);

        // 각 데이터 섹션 생성
        const imagesData = generateImagesData(settings, settings.imageEnabled && activeComponents.image);
        const messageData = generateMessageData(settings, settings.textEnabled && activeComponents.text);
        const buttonsData = generateButtonsData(buttons, settings.buttonEnabled && activeComponents.button);
        const showArray = generateShowArray(settings, activeComponents);

        // 최종 JSON 구조
        const jsonData = {
            display: safeString(displayType).toUpperCase() || 'BOX',
            theme: safeString(theme),
            template: safeString(template),
            show: showArray,
            location: safeString(settings.location) || 'TOP',
            images: imagesData,
            msg: messageData,
            today: settings.showTodayOption ? 'Y' : 'N',
            buttons: buttonsData
        };

        console.log('✅ JSON 생성 완료:', jsonData);
        return jsonData;

    } catch (error) {
        console.error('❌ JSON 생성 실패:', error);

        // 에러 발생 시 안전한 기본값 반환
        return generateFallbackJson(displayType);
    }
};

/**
 * 에러 발생 시 안전한 기본 JSON 반환
 * @param {string} displayType - 표시형태
 * @returns {Object} 안전한 기본 JSON
 */
export const generateFallbackJson = (displayType) => {
    console.log('🛡️ 안전한 기본 JSON 생성');

    const { theme, template } = getThemeTemplate(displayType || 'BOX');

    return {
        display: safeString(displayType).toUpperCase() || 'BOX',
        theme: theme,
        template: template,
        show: ['msg'],
        location: 'TOP',
        images: [],
        msg: {
            title: '기본 제목',
            text: '기본 내용'
        },
        today: 'N',
        buttons: []
    };
};

/**
 * JSON 데이터 검증
 * @param {Object} jsonData - 검증할 JSON 데이터
 * @returns {Object} {isValid: boolean, errors: Array}
 */
export const validateJsonData = (jsonData) => {
    const errors = [];

    // 필수 필드 검증
    if (!jsonData.display) errors.push('display 필드 누락');
    if (!jsonData.theme) errors.push('theme 필드 누락');
    if (!jsonData.template) errors.push('template 필드 누락');
    if (!jsonData.location) errors.push('location 필드 누락');
    if (!Array.isArray(jsonData.show)) errors.push('show 필드가 배열이 아님');

    // show 배열과 실제 데이터 일치성 검증
    if (jsonData.show.includes('images') && (!jsonData.images || jsonData.images.length === 0)) {
        errors.push('show에 images가 있지만 images 데이터가 없음');
    }

    if (jsonData.show.includes('msg') && (!jsonData.msg || (!jsonData.msg.title && !jsonData.msg.text))) {
        errors.push('show에 msg가 있지만 메시지 데이터가 없음');
    }

    if (jsonData.show.includes('buttons') && (!jsonData.buttons || jsonData.buttons.length === 0)) {
        errors.push('show에 buttons가 있지만 버튼 데이터가 없음');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
// utils/jsonDataGenerator.js - 새로운 형식
import { getDisplayConfig } from '../config/displayTypeConfig';

/**
 * 새로운 형식의 InApp JSON 데이터 생성
 * @param {string} displayType - 표시형태
 * @param {Object} settings - 설정 객체
 * @param {Array} buttons - 버튼 배열
 * @returns {Object} JSON 데이터
 */
export const generateInAppJsonData = (displayType, settings, buttons = []) => {
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
        theme: config.theme,
        show: show,
        location: settings.location || config.defaultLocation || 'TOP'
    };

    // 이미지 데이터 - 이미지가 활성화되고 URL이 있을 때만
    if (settings.imageEnabled && settings.imageUrl) {
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

    // 메시지 데이터 - 텍스트가 활성화되었을 때
    if (settings.textEnabled) {
        jsonData.msg = {
            title: settings.titleContent || '',
            text: settings.bodyContent || ''
        };
    } else {
        jsonData.msg = {};
    }

    // 오늘하루 보지않기
    jsonData.today = settings.showTodayOption ? 'Y' : 'N';

    // 버튼 데이터 - 버튼이 활성화되고 텍스트가 있는 버튼만
    if (settings.buttonEnabled && config.button) {
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

    if (!jsonData.theme) {
        errors.push('테마(theme)가 없습니다.');
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
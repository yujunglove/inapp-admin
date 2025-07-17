import { getDisplayConfig } from '../config/appConfig';

function stripHtmlTags(html) {
    if (!html) return '';
    
    if (typeof document !== 'undefined') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    }
    
    return html.replace(/<[^>]*>/g, '').trim();
}

export const generateInAppJsonData = (displayType, settings, buttons = []) => {
    if (!displayType) {
        displayType = 'BOX';
    }
    
    const config = getDisplayConfig(displayType);

    const show = [];

    if (settings.imageEnabled && config.components.image) {
        show.push('images');
    }

    if (settings.textEnabled && config.components.text) {
        show.push('msg');
    }

    if (settings.buttonEnabled && config.components.button && buttons.some(btn => btn.text.trim())) {
        show.push('buttons');
    }

    const jsonData = {
        display: displayType.toUpperCase(),
        show: show,
        location: settings.location || config.location || 'TOP'
    };

    if (config.components.image) {
        if (settings.imageEnabled) {
            if (displayType.toUpperCase() === 'SLIDE' && settings.images && Array.isArray(settings.images)) {
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
        jsonData.images = [];
    }

    if (config.components.text) {
        if (settings.textEnabled) {
            jsonData.msg = {
                title: settings.titleContent || '',
                text: settings.bodyContent || ''
            };
        } else {
            jsonData.msg = {};
        }
    } else {
        jsonData.msg = {};
    }

    jsonData.today = settings.showTodayOption ? 'Y' : 'N';

    if (config.components.button) {
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
        jsonData.buttons = [];
    }

    return jsonData;
};

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
import { getDisplayConfig } from '../config/appConfig';

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
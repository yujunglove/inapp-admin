export const THEME_MAPPING = {
    BAR: {
        'images': { theme: 'T1', code: 'M1', cssClass: 'qdx_theme1-1' },
        'msg': { theme: 'T2', code: 'M2', cssClass: 'qdx_theme1-2' },
        'images,msg': { theme: 'T3', code: 'M3', cssClass: 'qdx_theme1-3' }
    },
    BOX: {
        'images': { theme: 'T4', code: 'M1', cssClass: 'qdx_theme2-1' },
        'images,buttons': { theme: 'T5', code: 'M4', cssClass: 'qdx_theme2-2' },
        'images,buttons2': { theme: 'T6', code: 'M5', cssClass: 'qdx_theme2-3' },
        'images,msg': { theme: 'T7', code: 'M3', cssClass: 'qdx_theme2-4' },
        'images,msg,buttons': { theme: 'T8', code: 'M6', cssClass: 'qdx_theme2-5' },
        'images,msg,buttons2': { theme: 'T9', code: 'M7', cssClass: 'qdx_theme2-6' }
    },
    SLIDE: {
        'images': { theme: 'T10', code: 'M1', cssClass: 'qdx_theme3-1' },
        'images,buttons': { theme: 'T11', code: 'M4', cssClass: 'qdx_theme3-2' },
        'images,buttons2': { theme: 'T12', code: 'M5', cssClass: 'qdx_theme3-3' },
        'images,msg': { theme: 'T13', code: 'M3', cssClass: 'qdx_theme3-4' },
        'images,msg,buttons': { theme: 'T14', code: 'M6', cssClass: 'qdx_theme3-5' },
        'images,msg,buttons2': { theme: 'T15', code: 'M7', cssClass: 'qdx_theme3-6' }
    },
    STAR: {
        'msg': { theme: 'T16', code: 'M8', cssClass: 'qdx_theme4-1' }
    }
};

export const calculateTheme = (displayType, settings, buttons) => {
    const showComponents = [];

    if (settings.imageEnabled || (settings.images && settings.images.length > 0) || settings.imageUrl) {
        showComponents.push('images');
    }

    if (settings.textEnabled || settings.titleContent || settings.bodyContent || 
        (settings.msg && (settings.msg.title || settings.msg.text))) {
        showComponents.push('msg');
    }

    const hasButtons = settings.buttonEnabled || (buttons && buttons.length > 0) || 
                      (settings.buttons && settings.buttons.length > 0);
    
    if (hasButtons) {
        const buttonCount = buttons?.length || settings.buttons?.length || 1;
        showComponents.push(buttonCount >= 2 ? 'buttons2' : 'buttons');
    }

    const showKey = showComponents.join(',');
    const themeInfo = THEME_MAPPING[displayType?.toUpperCase()]?.[showKey];

    return {
        theme: themeInfo?.theme || (displayType?.toUpperCase() === 'BOX' ? 'T4' : 'T1'),
        code: themeInfo?.code || 'M1',
        cssClass: themeInfo?.cssClass || (displayType?.toUpperCase() === 'BOX' ? 'qdx_theme2-1' : 'qdx_theme1-1'),
        show: showComponents
    };
};
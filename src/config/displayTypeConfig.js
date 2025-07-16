export const canToggleComponent = (displayType, componentType) => {
    const config = getDisplayConfig(displayType);
    if (!config[componentType]) {
        return false;
    }
    if (config.forceEnabled?.[componentType]) {
        return false;
    }
    return true;
};

export const displayComponentConfig = {
    BAR: {
        image: true,
        text: true,
        button: false,
        theme: 'T3',
        defaultLocation: 'TOP',
        forceEnabled: {}
    },
    BOX: {
        image: true,
        text: true,
        button: true,
        theme: 'T4',
        defaultLocation: 'TOP',
        forceEnabled: {}
    },
    STAR: {
        image: false,
        text: true,
        button: false,
        theme: 'T9',
        defaultLocation: 'TOP',
        forceEnabled: {}
    },
    SLIDE: {
        image: true,
        text: true,
        button: true,
        theme: 'T11',
        defaultLocation: 'TOP',
        forceEnabled: {}
    }
};

export const getDisplayConfig = (displayType) => {
    const config = displayComponentConfig[displayType?.toUpperCase()];
    if (!config) {
        return displayComponentConfig.BOX;
    }
    return config;
};

export const getActiveComponents = (displayType) => {
    const config = getDisplayConfig(displayType);
    return {
        image: config.image,
        text: config.text,
        button: config.button
    };
};

export const getThemeTemplate = (displayType) => {
    const config = getDisplayConfig(displayType);
    return {
        theme: config.theme
    };
};

export const getDefaultLocation = (displayType) => {
    const config = getDisplayConfig(displayType);
    return config.defaultLocation;
};

export const createInitialSettings = (displayType) => {
    const config = getDisplayConfig(displayType);
    
    const initialSettings = {
        imageEnabled: config.forceEnabled?.image || false,
        textEnabled: config.forceEnabled?.text || false,
        buttonEnabled: config.forceEnabled?.button || false,
        location: config.defaultLocation,
        clickAction: '',
        imageUrl: '',
        linkTarget: 'current',
        linkUrl: '',
        titleContent: '',
        bodyContent: '',
        showTodayOption: true
    };
    
    return initialSettings;
};

export const displayValidationRules = {
    BAR: {
        textRequired: true,
        imageAllowed: true,
        buttonAllowed: false
    },
    BOX: {
        textRequired: false,
        imageAllowed: true,
        buttonAllowed: true
    },
    STAR: {
        textRequired: true,
        imageAllowed: false,
        buttonAllowed: false
    },
    SLIDE: {
        textRequired: false,
        imageAllowed: true,
        buttonAllowed: true
    }
};

export const getValidationRules = (displayType) => {
    return displayValidationRules[displayType?.toUpperCase()] || displayValidationRules.BOX;
};
import { hardcodedData } from '../constants/inAppConstants';

export const createApiConfig = (config) => {
    return {
        displayUrl: config.displayUrl || config.getInAppDisplayUrl || '',
        themeUrl: config.themeUrl || config.getInAppThemeUrl || '',
        locationUrl: config.locationUrl || config.getInAppLocationUrl || '',
        templateUrl: config.templateUrl || config.getInAppTemplateUrl || '',
        fetchFunction: config.fetchFunction || window.fetch
    };
};

export const hasValidApiUrls = (apiConfig) => {
    return apiConfig.displayUrl && apiConfig.themeUrl &&
        apiConfig.locationUrl && apiConfig.templateUrl;
};

export const loadInAppData = async (apiConfig) => {
    try {
        if (!hasValidApiUrls(apiConfig)) {
            return {
                displayTypes: hardcodedData.displayTypes,
                themes: hardcodedData.themes,
                locations: hardcodedData.locations,
                templates: hardcodedData.templates
            };
        }

        const fetchFn = apiConfig.fetchFunction;

        const [displayRes, themeRes, locationRes, templateRes] = await Promise.all([
            fetchFn(apiConfig.displayUrl),
            fetchFn(apiConfig.themeUrl),
            fetchFn(apiConfig.locationUrl),
            fetchFn(apiConfig.templateUrl)
        ]);

        let newDisplayTypes = [];
        let newThemes = [];
        let newLocations = [];
        let newTemplates = [];

        if (displayRes && displayRes.success) {
            newDisplayTypes = displayRes.codeList || [];
        }

        if (themeRes && themeRes.success) {
            newThemes = themeRes.codeList || [];
        }

        if (locationRes && locationRes.success) {
            newLocations = locationRes.codeList || [];
        }

        if (templateRes && templateRes.success) {
            newTemplates = templateRes.codeList || [];
        }

        return {
            displayTypes: newDisplayTypes,
            themes: newThemes,
            locations: newLocations,
            templates: newTemplates
        };

    } catch (err) {
        throw err;
    }
};
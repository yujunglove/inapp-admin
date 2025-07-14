import { hardcodedData } from '../constants/inAppConstants';

/**
 * API 설정 객체 생성
 */
export const createApiConfig = (config) => {
    return {
        displayUrl: config.displayUrl || config.getInAppDisplayUrl || '',
        themeUrl: config.themeUrl || config.getInAppThemeUrl || '',
        locationUrl: config.locationUrl || config.getInAppLocationUrl || '',
        templateUrl: config.templateUrl || config.getInAppTemplateUrl || '',
        fetchFunction: config.fetchFunction || window.fetch
    };
};

/**
 * API URL 유효성 검사
 */
export const hasValidApiUrls = (apiConfig) => {
    return apiConfig.displayUrl && apiConfig.themeUrl &&
        apiConfig.locationUrl && apiConfig.templateUrl;
};

/**
 * 모든 InApp 데이터 로드
 */
export const loadInAppData = async (apiConfig) => {
    try {
        console.log('API 요청 시작:');
        console.log('Display URL:', apiConfig.displayUrl);
        console.log('Theme URL:', apiConfig.themeUrl);
        console.log('Location URL:', apiConfig.locationUrl);
        console.log('Template URL:', apiConfig.templateUrl);

        // json에 config를 찾을 수 없으면 하드코딩한 거 기본으로 제공
        if (!hasValidApiUrls(apiConfig)) {
            console.log('API URL이 제공되지 않아 하드코딩된 데이터를 사용합니다.');
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

        console.log('=== API 응답 결과 ===');

        let newDisplayTypes = [];
        let newThemes = [];
        let newLocations = [];
        let newTemplates = [];

        if (displayRes && displayRes.success) {
            console.log('✅ Display 데이터:', displayRes);
            console.log('Display 코드 리스트:', displayRes.codeList);
            newDisplayTypes = displayRes.codeList || [];
        } else {
            console.log('❌ Display 데이터 실패:', displayRes);
        }

        if (themeRes && themeRes.success) {
            console.log('✅ Theme 데이터:', themeRes);
            console.log('Theme 코드 리스트:', themeRes.codeList);
            newThemes = themeRes.codeList || [];
        } else {
            console.log('❌ Theme 데이터 실패:', themeRes);
        }

        if (locationRes && locationRes.success) {
            console.log('✅ Location 데이터:', locationRes);
            console.log('Location 코드 리스트:', locationRes.codeList);
            newLocations = locationRes.codeList || [];
        } else {
            console.log('❌ Location 데이터 실패:', locationRes);
        }

        if (templateRes && templateRes.success) {
            console.log('✅ Template 데이터:', templateRes);
            console.log('Template 코드 리스트:', templateRes.codeList);
            newTemplates = templateRes.codeList || [];
        } else {
            console.log('❌ Template 데이터 실패:', templateRes);
        }

        console.log('🔄 업데이트할 데이터:');
        console.log('- newDisplayTypes:', newDisplayTypes);
        console.log('- newThemes:', newThemes);
        console.log('- newLocations:', newLocations);
        console.log('- newTemplates:', newTemplates);

        return {
            displayTypes: newDisplayTypes,
            themes: newThemes,
            locations: newLocations,
            templates: newTemplates
        };

    } catch (err) {
        console.error('❌ 데이터 로딩 실패:', err);
        console.error('에러 상세:', err.message);
        console.error('스택 트레이스:', err.stack);
        throw err;
    }
};
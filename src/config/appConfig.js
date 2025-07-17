/**
 * 통합된 앱 설정 파일
 * 모든 display type, template, validation 규칙을 한 곳에서 관리
 */

// 표시 유형별 상세 설정
export const DISPLAY_TYPE_CONFIG = {
    BAR: {
        name: 'BAR',
        components: {
            image: true,
            text: true,
            button: false
        },
        forceEnabled: {},  // BAR형은 이미지, 텍스트 토글 가능
        theme: 'T3',
        template: 'M3',
        location: 'TOP',
        validation: {
            textRequired: true,
            imageRequired: true,
            buttonAllowed: false
        }
    },
    BOX: {
        name: 'BOX',
        components: {
            image: true,
            text: true,
            button: true
        },
        forceEnabled: {},
        theme: 'T4',
        template: 'M1',
        location: 'TOP',
        validation: {
            textRequired: false,
            imageRequired: false,
            buttonAllowed: true
        }
    },
    STAR: {
        name: 'STAR',
        components: {
            image: false,
            text: true,
            button: false
        },
        forceEnabled: {},  // STAR형은 텍스트 토글 가능
        theme: 'T9',
        template: 'M8',
        location: 'TOP',
        validation: {
            textRequired: true,
            imageRequired: false,
            buttonAllowed: false
        }
    },
    SLIDE: {
        name: 'SLIDE',
        components: {
            image: true,
            text: true,
            button: true
        },
        forceEnabled: {},
        theme: 'T11',
        template: 'M4',
        location: 'TOP',
        validation: {
            textRequired: false,
            imageRequired: false,
            buttonAllowed: true
        }
    }
};

// 템플릿 설정
export const TEMPLATE_CONFIG = {
    'M1': { name: '이미지', hasImage: true, hasText: false, buttonCount: 0 },
    'M2': { name: '텍스트', hasImage: false, hasText: true, buttonCount: 0 },
    'M3': { name: '이미지 + 텍스트', hasImage: true, hasText: true, buttonCount: 0 },
    'M4': { name: '이미지 + 버튼 1', hasImage: true, hasText: false, buttonCount: 1 },
    'M5': { name: '이미지 + 버튼 2', hasImage: true, hasText: false, buttonCount: 2 },
    'M6': { name: '이미지 + 텍스트 + 버튼 1', hasImage: true, hasText: true, buttonCount: 1 },
    'M7': { name: '이미지 + 텍스트 + 버튼 2', hasImage: true, hasText: true, buttonCount: 2 },
    'M8': { name: '설문', hasImage: false, hasText: true, buttonCount: 0 }
};

// 하드코딩된 데이터 (공통코드가 없을 때 사용)
export const HARDCODED_DATA = {
    displayTypes: [
        { code: 'bar', codeNm: 'BAR' },
        { code: 'box', codeNm: 'BOX' },
        { code: 'star', codeNm: 'STAR' },
        { code: 'slide', codeNm: 'SLIDE' }
    ],
    locations: [
        { code: 'TOP', codeNm: '상단' },
        { code: 'MID', codeNm: '중앙' },
        { code: 'BOT', codeNm: '하단' }
    ]
};

// 헬퍼 함수들

/**
 * 표시 유형에 따른 설정 가져오기
 */
export const getDisplayConfig = (displayType) => {
    const config = DISPLAY_TYPE_CONFIG[displayType?.toUpperCase()];
    return config || DISPLAY_TYPE_CONFIG.BOX;
};

/**
 * 활성화된 컴포넌트 가져오기
 */
export const getActiveComponents = (displayType) => {
    const config = getDisplayConfig(displayType);
    return config.components;
};

/**
 * 컴포넌트 토글 가능 여부 확인
 */
export const canToggleComponent = (displayType, componentType) => {
    const config = getDisplayConfig(displayType);
    if (!config.components[componentType]) {
        return false;
    }
    return !config.forceEnabled[componentType];
};

/**
 * 테마 템플릿 가져오기
 */
export const getThemeTemplate = (displayType) => {
    const config = getDisplayConfig(displayType);
    return {
        theme: config.theme,
        template: config.template
    };
};

/**
 * 기본 위치 가져오기
 */
export const getDefaultLocation = (displayType) => {
    const config = getDisplayConfig(displayType);
    return config.location;
};

/**
 * 초기 설정 생성
 */
export const createInitialSettings = (displayType) => {
    const config = getDisplayConfig(displayType);
    
    return {
        imageEnabled: config.forceEnabled?.image || false,
        textEnabled: config.forceEnabled?.text || false,
        buttonEnabled: config.forceEnabled?.button || false,
        location: config.location,
        clickAction: '',
        imageUrl: '',
        linkTarget: 'current',
        linkUrl: '',
        titleContent: '',
        bodyContent: '',
        showTodayOption: true
    };
};

/**
 * 검증 규칙 가져오기
 */
export const getValidationRules = (displayType) => {
    const config = getDisplayConfig(displayType);
    return config.validation;
};

/**
 * 기본 미리보기 데이터 생성
 */
export const createDefaultPreviewData = (displayType) => {
    const config = getDisplayConfig(displayType);
    if (!config) return null;

    const template = TEMPLATE_CONFIG[config.template];
    const baseData = {
        display: config.name,
        template: config.template,
        code: config.template,
        location: config.location,
        today: "N",
        show: []
    };

    // show 배열 구성
    if (template.hasImage) {
        baseData.show.push('images');
    }
    if (template.hasText) {
        baseData.show.push('msg');
    }
    if (template.buttonCount > 0) {
        baseData.show.push(template.buttonCount >= 2 ? 'buttons2' : 'buttons');
    }

    // 이미지 데이터
    baseData.images = template.hasImage ? [{
        seq: 1,
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhFjJgDxmK9CVk3XxTiitDyZLIOKJvtZNLrg&s",
        action: "",
        linkUrl: "",
        linkOpt: ""
    }] : [];

    // 텍스트 데이터
    baseData.msg = template.hasText ? {
        title: `${config.name}형 미리보기`,
        text: "이것은 미리보기 내용입니다."
    } : {};

    // 버튼 데이터
    baseData.buttons = [];
    if (template.buttonCount > 0) {
        for (let i = 1; i <= template.buttonCount; i++) {
            baseData.buttons.push({
                seq: i,
                text: `버튼 ${i}`,
                linkUrl: "http://www.example.com",
                linkOpt: ""
            });
        }
    }

    return baseData;
};

/**
 * 템플릿 코드로 설정 가져오기
 */
export const getTemplateConfig = (templateCode) => {
    return TEMPLATE_CONFIG[templateCode] || TEMPLATE_CONFIG['M1'];
};

/**
 * 표시 유형별 사용 가능한 템플릿 가져오기
 */
export const getAvailableTemplates = (displayType) => {
    const config = getDisplayConfig(displayType);
    const templates = [];
    
    Object.entries(TEMPLATE_CONFIG).forEach(([code, template]) => {
        // 표시 유형의 컴포넌트 설정과 템플릿이 호환되는지 확인
        const isCompatible = 
            (!template.hasImage || config.components.image) &&
            (!template.hasText || config.components.text) &&
            (template.buttonCount === 0 || config.components.button);
            
        if (isCompatible) {
            templates.push({ code, ...template });
        }
    });
    
    return templates;
};
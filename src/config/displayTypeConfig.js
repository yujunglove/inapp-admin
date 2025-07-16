/**
 * 토글 가능 여부 확인
 * @param {string} displayType - 표시형태
 * @param {string} componentType - 컴포넌트 타입 (image, text, button)
 * @returns {boolean} 토글 가능 여부
 */
export const canToggleComponent = (displayType, componentType) => {
    const config = getDisplayConfig(displayType);

    // 해당 컴포넌트가 지원되지 않으면 토글 불가
    if (!config[componentType]) {
        return false;
    }

    // 강제 활성화 항목은 토글 불가
    if (config.forceEnabled?.[componentType]) {
        return false;
    }

    return true;
};

/**
 * 표시형태별 컴포넌트 활성화 설정 (새로운 형식)
 */
export const displayComponentConfig = {
    BAR: {
        image: true,        // 바형은 이미지 가능
        text: true,         // 텍스트 가능
        button: false,      // 버튼 불가
        theme: 'T3',        // 바형 전용 테마
        defaultLocation: 'TOP',
        forceEnabled: {}    // 강제 활성화 제거 - 사용자가 선택할 수 있게
    },
    BOX: {
        image: true,        // 박스형은 이미지 가능
        text: true,         // 텍스트 가능
        button: true,       // 버튼 가능
        theme: 'T4',        // 박스형 전용 테마 (T1에서 T4로 변경)
        defaultLocation: 'TOP',
        forceEnabled: {}    // 자유 선택
    },
    STAR: {
        image: false,       // 별점형은 이미지 없음
        text: true,         // 텍스트 필수 (별점 + 텍스트)
        button: false,      // 버튼 없음
        theme: 'T9',        // 별점형 전용 테마
        defaultLocation: 'TOP',
        forceEnabled: {}    // 자유 선택
    },
    SLIDE: {
        image: true,        // 슬라이드형은 이미지 필수
        text: true,         // 텍스트 가능
        button: true,       // 버튼 가능
        theme: 'T11',       // 슬라이드형 전용 테마
        defaultLocation: 'TOP',
        forceEnabled: {}    // 자유 선택
    }
};

/**
 * 표시형태별 설정 가져오기
 * @param {string} displayType - 표시형태 (BAR, BOX, STAR, SLIDE)
 * @returns {Object} 해당 표시형태의 설정
 */
export const getDisplayConfig = (displayType) => {
    const config = displayComponentConfig[displayType?.toUpperCase()];

    if (!config) {
        console.warn(`알 수 없는 표시형태: ${displayType}, 기본값 사용`);
        return displayComponentConfig.BOX; // 기본값
    }

    return config;
};

/**
 * 표시형태별 활성화 가능한 컴포넌트 확인
 * @param {string} displayType - 표시형태
 * @returns {Object} {image: boolean, text: boolean, button: boolean}
 */
export const getActiveComponents = (displayType) => {
    const config = getDisplayConfig(displayType);

    return {
        image: config.image,
        text: config.text,
        button: config.button
    };
};

/**
 * 표시형태별 테마 가져오기 (template은 제거됨)
 * @param {string} displayType - 표시형태
 * @returns {Object} {theme: string}
 */
export const getThemeTemplate = (displayType) => {
    const config = getDisplayConfig(displayType);

    return {
        theme: config.theme
    };
};

/**
 * 표시형태별 기본 위치 가져오기
 * @param {string} displayType - 표시형태
 * @returns {string} 기본 위치 (TOP, MID, BOTTOM)
 */
export const getDefaultLocation = (displayType) => {
    const config = getDisplayConfig(displayType);
    return config.defaultLocation;
};

/**
 * 표시형태 변경 시 초기 설정 생성
 * @param {string} displayType - 변경할 표시형태
 * @returns {Object} 초기 설정 객체
 */
export const createInitialSettings = (displayType) => {
    const config = getDisplayConfig(displayType);
    
    console.log('🔧 createInitialSettings:', {
        displayType,
        config,
        forceEnabled: config.forceEnabled
    });

    const initialSettings = {
        // 🔥 강제 활성화 항목은 true, 나머지는 false로 시작
        imageEnabled: config.forceEnabled?.image || false,
        textEnabled: config.forceEnabled?.text || false,
        buttonEnabled: config.forceEnabled?.button || false, // 버튼도 강제 활성화 지원
        location: config.defaultLocation,
        clickAction: '',
        imageUrl: '',
        linkTarget: 'current',
        linkUrl: '',
        titleContent: '',
        bodyContent: '',
        showTodayOption: true // 기본적으로 true
    };
    
    console.log('🔧 생성된 초기 설정:', initialSettings);
    return initialSettings;
};

/**
 * 표시형태별 검증 규칙
 */
export const displayValidationRules = {
    BAR: {
        textRequired: true,     // 텍스트 필수
        imageAllowed: true,     // 이미지 가능
        buttonAllowed: false    // 버튼 불가
    },
    BOX: {
        textRequired: false,    // 텍스트 선택
        imageAllowed: true,     // 이미지 가능
        buttonAllowed: true     // 버튼 가능
    },
    STAR: {
        textRequired: true,     // 텍스트 필수 (별점 설명)
        imageAllowed: false,    // 이미지 불가
        buttonAllowed: false    // 버튼 불가
    },
    SLIDE: {
        textRequired: false,    // 텍스트 선택
        imageAllowed: true,     // 이미지 가능 (강제)
        buttonAllowed: true     // 버튼 가능
    }
};

/**
 * 표시형태별 검증 규칙 가져오기
 * @param {string} displayType - 표시형태
 * @returns {Object} 검증 규칙
 */
export const getValidationRules = (displayType) => {
    return displayValidationRules[displayType?.toUpperCase()] || displayValidationRules.BOX;
};
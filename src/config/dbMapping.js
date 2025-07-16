export const DB_MAPPING = {
    DISPLAY_TYPES: {
        BAR: {
            defaultTheme: 'T3', // 이미지 + 텍스트형 (가장 기본)
            defaultTemplate: 'M3',
            defaultLocation: 'TOP',
            hasImage: true,
            hasText: true,
            buttonCount: 0
        },
        BOX: {
            defaultTheme: 'T4', // 이미지형 (가장 기본)
            defaultTemplate: 'M1',
            defaultLocation: 'TOP',
            hasImage: true,
            hasText: false,
            buttonCount: 0
        },
        SLIDE: {
            defaultTheme: 'T11', // 이미지형 + 버튼1 (기본)
            defaultTemplate: 'M4',
            defaultLocation: 'TOP',
            hasImage: true,
            hasText: false,
            buttonCount: 1
        },
        STAR: {
            defaultTheme: 'T16', // 텍스트형 (유일)
            defaultTemplate: 'M8',
            defaultLocation: 'TOP',
            hasImage: false,
            hasText: true,
            buttonCount: 0
        }
    },

    TEMPLATES: {
        'M1': { hasImage: true, hasText: false, buttonCount: 0 }, // 이미지
        'M2': { hasImage: false, hasText: true, buttonCount: 0 }, // 텍스트
        'M3': { hasImage: true, hasText: true, buttonCount: 0 }, // 이미지 + 텍스트
        'M4': { hasImage: true, hasText: false, buttonCount: 1 }, // 이미지 + 버튼1
        'M5': { hasImage: true, hasText: false, buttonCount: 2 }, // 이미지 + 버튼2
        'M6': { hasImage: true, hasText: true, buttonCount: 1 }, // 이미지 + 텍스트 + 버튼1
        'M7': { hasImage: true, hasText: true, buttonCount: 2 }, // 이미지 + 텍스트 + 버튼2
        'M8': { hasImage: false, hasText: true, buttonCount: 0 } // 설문(텍스트)
    }
};

// 기본 미리보기 데이터 생성 함수
export const createDefaultPreviewData = (displayType) => {
    const upperDisplayType = displayType?.toUpperCase();
    const mapping = DB_MAPPING.DISPLAY_TYPES[upperDisplayType];

    if (!mapping) {
        console.log('⚠️ 알 수 없는 표시형태:', displayType);
        return null;
    }

    const baseData = {
        display: upperDisplayType,
        template: mapping.defaultTemplate,
        code: mapping.defaultTemplate,
        location: mapping.defaultLocation,
        today: "N",
        show: []
    };

    // show 배열 생성
    if (mapping.hasImage) {
        baseData.show.push('images');
    }
    if (mapping.hasText) {
        baseData.show.push('msg');
    }
    if (mapping.buttonCount > 0) {
        if (mapping.buttonCount >= 2) {
            baseData.show.push('buttons2');
        } else {
            baseData.show.push('buttons');
        }
    }

    // 이미지 추가
    if (mapping.hasImage) {
        baseData.images = [{
            seq: 1,
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhFjJgDxmK9CVk3XxTiitDyZLIOKJvtZNLrg&s",
            action: "",
            linkUrl: "",
            linkOpt: ""
        }];
    } else {
        baseData.images = [];
    }

    // 텍스트 추가
    if (mapping.hasText) {
        baseData.msg = {
            title: `${upperDisplayType}형 미리보기`,
            text: "이것은 미리보기 내용입니다."
        };
    } else {
        baseData.msg = {};
    }

    // 버튼 추가
    if (mapping.buttonCount > 0) {
        baseData.buttons = [];
        for (let i = 1; i <= mapping.buttonCount; i++) {
            baseData.buttons.push({
                seq: i,
                text: `버튼 ${i}`,
                linkUrl: "http://www.example.com",
                linkOpt: ""
            });
        }
    } else {
        baseData.buttons = [];
    }

    console.log('🏗️ 기본 미리보기 데이터 생성:', baseData);

    return baseData;
};
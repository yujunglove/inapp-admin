export const DB_MAPPING = {
    DISPLAY_TYPES: {
        BAR: {
            defaultTheme: 'T3',
            defaultTemplate: 'M3',
            defaultLocation: 'TOP',
            hasImage: true,
            hasText: true,
            buttonCount: 0
        },
        BOX: {
            defaultTheme: 'T4',
            defaultTemplate: 'M1',
            defaultLocation: 'TOP',
            hasImage: true,
            hasText: false,
            buttonCount: 0
        },
        SLIDE: {
            defaultTheme: 'T11',
            defaultTemplate: 'M4',
            defaultLocation: 'TOP',
            hasImage: true,
            hasText: false,
            buttonCount: 1
        },
        STAR: {
            defaultTheme: 'T16',
            defaultTemplate: 'M8',
            defaultLocation: 'TOP',
            hasImage: false,
            hasText: true,
            buttonCount: 0
        }
    },

    TEMPLATES: {
        'M1': { hasImage: true, hasText: false, buttonCount: 0 },
        'M2': { hasImage: false, hasText: true, buttonCount: 0 },
        'M3': { hasImage: true, hasText: true, buttonCount: 0 },
        'M4': { hasImage: true, hasText: false, buttonCount: 1 },
        'M5': { hasImage: true, hasText: false, buttonCount: 2 },
        'M6': { hasImage: true, hasText: true, buttonCount: 1 },
        'M7': { hasImage: true, hasText: true, buttonCount: 2 },
        'M8': { hasImage: false, hasText: true, buttonCount: 0 }
    }
};

export const createDefaultPreviewData = (displayType) => {
    const upperDisplayType = displayType?.toUpperCase();
    const mapping = DB_MAPPING.DISPLAY_TYPES[upperDisplayType];

    if (!mapping) {
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

    if (mapping.hasText) {
        baseData.msg = {
            title: `${upperDisplayType}형 미리보기`,
            text: "이것은 미리보기 내용입니다."
        };
    } else {
        baseData.msg = {};
    }

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

    return baseData;
};
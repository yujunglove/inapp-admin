export const getCurrentItems = (currentStep, displayTypes, locations, selections) => {
    if (currentStep === 1) {
        const displayTypeImages = {
            BAR: '/src/images/bar-removebg-preview.png',
            BOX: '/src/images/box-removebg-preview.png',
            SLIDE: '/src/images/slide-removebg-preview.png',
            STAR: '/src/images/star-removebg-preview.png'
        };

        const items = displayTypes.map(item => ({
            id: item.code,
            name: item.codeNm,
            image: displayTypeImages[item.code] || `/src/images/${item.code.toLowerCase()}-removebg-preview.png`
        }));

        return items;
    }
    return [];
};

export const getCurrentStepTitle = (currentStep) => {
    if (currentStep === 1) return '디스플레이 선택';
    if (currentStep === 2) return '커스터마이징 옵션';
    return '설정';
};

export const getCurrentStepNumber = (currentStep) => {
    return `${currentStep}/2`;
};

export const isNextEnabled = (currentStep, selections) => {
    if (currentStep === 1) return selections.displayType !== null;
    if (currentStep === 2) return true;
    return true;
};
// 이미지들을 import
import barImage from '../assets/bar-removebg-preview.png';
import boxImage from '../assets/box-removebg-preview.png';
import slideImage from '../assets/slide-removebg-preview.png';
import starImage from '../assets/star-removebg-preview.png';

export const getCurrentItems = (currentStep, displayTypes, locations, selections) => {
    if (currentStep === 1) {
        const displayTypeImages = {
            bar: barImage,
            box: boxImage,
            slide: slideImage,
            star: starImage,
            // 대문자 버전도 추가 (호환성을 위해)
            BAR: barImage,
            BOX: boxImage,
            SLIDE: slideImage,
            STAR: starImage
        };

        const items = displayTypes.map(item => ({
            id: item.code,
            name: item.codeNm,
            image: displayTypeImages[item.code] || boxImage // 기본 이미지
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
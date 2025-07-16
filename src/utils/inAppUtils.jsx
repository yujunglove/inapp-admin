/**
 * 현재 스텝에 따라 선택 가능한 항목들 반환 (노출위치 단계 제거)
 */
export const getCurrentItems = (currentStep, displayTypes, locations, selections) => {
    if (currentStep === 1) {
        // 이미지 경로 매핑 추가
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

        console.log('Step 1 - Display 항목들:', items);
        console.log('실제 displayTypes 데이터:', displayTypes);
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
    if (currentStep === 2) return true; // 상세 설정은 항상 진행 가능
    return true;
};
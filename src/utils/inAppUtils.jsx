// utils/inAppUtils.js
import { displayComponentMapping } from '../constants/inAppConstants';

/**
 * 현재 스텝에 따라 선택 가능한 항목들 반환 (노출위치 단계 제거)
 */
export const getCurrentItems = (currentStep, displayTypes, locations, selections) => {
    if (currentStep === 1) {
        const items = displayTypes.map(item => ({
            id: item.code,
            name: item.codeNm,
            image: `https://placehold.co/150x100/e3f2fd/1976d2?text=${encodeURIComponent(item.codeNm)}`
        }));
        console.log('Step 1 - Display 항목들:', items);
        console.log('실제 displayTypes 데이터:', displayTypes);
        return items;
    }
    // 2단계는 커스터마이징 설정이므로 항목 목록이 필요없음
    return [];
};

/**
 * 현재 스텝 제목 반환 (2단계로 축소)
 */
export const getCurrentStepTitle = (currentStep) => {
    if (currentStep === 1) return '표시형태 선택';
    if (currentStep === 2) return '커스터마이징 옵션';
    return '설정';
};

/**
 * 현재 스텝 번호 반환 (2단계로 축소)
 */
export const getCurrentStepNumber = (currentStep) => {
    return `${currentStep}/2`;
};

/**
 * 다음 단계 진행 가능 여부 확인 (노출위치 제거)
 */
export const isNextEnabled = (currentStep, selections) => {
    if (currentStep === 1) return selections.displayType !== null;
    if (currentStep === 2) return true; // 상세 설정은 항상 진행 가능
    return true;
};

/**
 * 마지막 스텝 여부 확인 (2단계가 마지막)
 */
export const isLastStep = (currentStep) => {
    return currentStep === 2;
};

/**
 * 표시형태에 따른 컴포넌트 활성화 정보 반환
 */
export const getComponentConfig = (displayType) => {
    return displayComponentMapping[displayType] || {
        image: false,
        text: false,
        button: false
    };
};
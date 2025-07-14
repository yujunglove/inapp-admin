// hooks/useInAppData.js
import { useState, useEffect } from 'react';
import { loadInAppData, createApiConfig } from '../services/inAppApi';

/**
 * InApp 데이터 관리 커스텀 훅
 */
export const useInAppData = (config) => {
    const [displayTypes, setDisplayTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiConfig = createApiConfig(config);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await loadInAppData(apiConfig);

                console.log('🔄 상태 업데이트 시작...');
                setDisplayTypes(data.displayTypes);
                setLocations(data.locations);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                console.log('🏁 로딩 완료');
            }
        };

        fetchData();
    }, []);

    // 상태 변경 감지
    useEffect(() => {
        console.log('📊 상태 변경 감지:');
        console.log('- displayTypes:', displayTypes, '길이:', displayTypes?.length || 0);
        console.log('- locations:', locations, '길이:', locations?.length || 0);
    }, [displayTypes, locations]);

    return {
        displayTypes,
        locations,
        loading,
        error
    };
};

/**
 * InApp 선택 상태 관리 커스텀 훅 (2단계 구조)
 */
export const useInAppSelections = (onDataChange, loading) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selections, setSelections] = useState({
        displayType: null,
        position: 'DEFAULT'  // 기본값으로 고정
    });

    // 선택사항 변경 시 외부로 데이터 전달
    useEffect(() => {
        if (!loading) {
            const currentData = {
                display: selections.displayType,
                location: selections.position,
            };
            onDataChange(currentData);
        }
    }, [selections, onDataChange, loading]);

    // 항목 선택 핸들러 (1단계: 표시형태 선택만)
    const handleItemSelect = (itemId) => {
        console.log(`선택됨 - Step ${currentStep}:`, itemId);

        if (currentStep === 1) {
            console.log('표시형태 선택:', itemId);
            setSelections({
                ...selections,
                displayType: itemId,
                position: 'DEFAULT' // 기본 위치값 자동 설정
            });
        }
    };

    // 다음 단계로 이동 (2단계로 축소)
    const handleNext = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        }
    };

    // 이전 단계로 이동 (2단계로 축소)
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // 초기 데이터 설정
    const setInitialData = (initialData) => {
        if (initialData && !loading) {
            setSelections({
                displayType: initialData.display,
                position: initialData.location || 'DEFAULT'
            });

            // 초기 데이터가 있으면 해당 단계로 이동
            if (initialData.display) {
                setCurrentStep(2); // 표시형태가 이미 선택되어 있으면 2단계로
            }
        }
    };

    return {
        currentStep,
        selections,
        handleItemSelect,
        handleNext,
        handleBack,
        setInitialData
    };
};
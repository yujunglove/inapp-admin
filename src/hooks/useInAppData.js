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
                setDisplayTypes(data.displayTypes);
                setLocations(data.locations);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
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
        position: 'TOP'  // 기본값 TOP으로 변경
    });
    
    // 🔥 사용자 설정 보존을 위한 상태
    const [preservedSettings, setPreservedSettings] = useState({
        titleContent: '',
        bodyContent: '',
        imageUrl: '',
        linkUrl: '',
        clickAction: '',
        linkTarget: 'current',
        textEnabled: false,
        imageEnabled: false,
        buttonEnabled: false,
        buttons: []
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
            console.log('🔄 표시형태 변경:', selections.displayType, '->', itemId);
            setSelections({
                ...selections,
                displayType: itemId,
                position: 'TOP' // 기본 위치값 자동 설정
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
                position: initialData.location || 'TOP'
            });

            if (initialData.display) {
                setCurrentStep(2);
            }
        }
    };

    return {
        currentStep,
        selections,
        handleItemSelect,
        handleNext,
        handleBack,
        setInitialData,
        preservedSettings,
        setPreservedSettings
    };
};
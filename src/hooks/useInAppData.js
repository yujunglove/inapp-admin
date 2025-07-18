import { useState, useEffect } from 'react';
import { loadInAppData, createApiConfig } from '../services/inAppService';
import { HARDCODED_DATA } from '../config/appConfig';

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
                
                // 데이터가 없으면 하드코딩된 데이터 사용
                if (!data.displayTypes || data.displayTypes.length === 0) {
                    setDisplayTypes(HARDCODED_DATA.displayTypes);
                    setLocations(HARDCODED_DATA.locations);
                } else {
                    setDisplayTypes(data.displayTypes);
                    setLocations(data.locations || HARDCODED_DATA.locations);
                }
            } catch (err) {
                // 에러 발생 시 하드코딩된 데이터 사용
                console.error('Failed to load data:', err);
                setDisplayTypes(HARDCODED_DATA.displayTypes);
                setLocations(HARDCODED_DATA.locations);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return {
        displayTypes,
        locations,
        loading,
        error
    };
};

export const useInAppSelections = (onDataChange, loading) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selections, setSelections] = useState({
        displayType: 'BAR',  // BAR를 기본값으로 설정
        position: 'TOP'
    });
    
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
        buttons: [],
        images: []
    });

    // 로딩 완료 후 기본값 설정
    useEffect(() => {
        if (!loading && !selections.displayType) {
            setSelections(prev => ({
                ...prev,
                displayType: 'BAR'
            }));
        }
    }, [loading]);

    useEffect(() => {
        if (!loading) {
            const currentData = {
                display: selections.displayType,
                location: selections.position,
            };
            onDataChange(currentData);
        }
    }, [selections, onDataChange, loading]);

    const handleItemSelect = (itemId) => {
        if (currentStep === 1) {
            setSelections({
                ...selections,
                displayType: itemId,
                position: 'TOP'
            });
        }
    };

    const handleNext = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

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
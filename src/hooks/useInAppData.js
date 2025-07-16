import { useState, useEffect } from 'react';
import { loadInAppData, createApiConfig } from '../services/inAppApi';

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
        displayType: null,
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
        buttons: []
    });

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
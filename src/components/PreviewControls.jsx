import React, { useState, useEffect } from 'react';
import { PreviewControlsArea, PreviewControlButton, LocationDropdown } from '../styles/StyledComponents';

const PreviewControls = ({ previewData, onTodayToggle, onJsonView, onLocationChange }) => {
    const [showLocationMenu, setShowLocationMenu] = useState(false);

    // 외부 클릭 시 위치 메뉴 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showLocationMenu && !event.target.closest('[data-location-menu]')) {
                setShowLocationMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showLocationMenu]);

    const handleLocationChange = (location) => {
        onLocationChange(location);
        setShowLocationMenu(false);
    };

    return (
        <PreviewControlsArea>
            <PreviewControlButton 
                className="today-check"
                active={previewData?.today === 'Y'}
                onClick={(e) => {
                    e.preventDefault();
                    onTodayToggle();
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"/>
                    <circle cx="12" cy="12" r="10"/>
                </svg>
                오늘하루 안보기
            </PreviewControlButton>
            
            <PreviewControlButton 
                className="json-view"
                onClick={(e) => {
                    e.preventDefault();
                    onJsonView();
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                </svg>
                JSON 보기
            </PreviewControlButton>
            
            <div style={{ position: 'relative' }} data-location-menu>
                <PreviewControlButton
                    className="location-btn"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowLocationMenu(!showLocationMenu);
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {previewData?.location || 'TOP'}
                </PreviewControlButton>
                
                {showLocationMenu && (
                    <LocationDropdown>
                        {['TOP', 'MID', 'BOT'].map(location => (
                            <button
                                key={location}
                                className={previewData?.location === location ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLocationChange(location);
                                }}
                            >
                                {location === 'TOP' ? '상단 (TOP)' : location === 'MID' ? '중앙 (MID)' : '하단 (BOT)'}
                            </button>
                        ))}
                    </LocationDropdown>
                )}
            </div>
        </PreviewControlsArea>
    );
};

export default PreviewControls;
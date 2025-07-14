import React, { useState } from 'react';

/**
 * 토글 박스 컴포넌트
 */
export const ToggleBox = ({ checked, onChange, disabled = false }) => {
    const toggleStyle = {
        position: 'relative',
        display: 'inline-block',
        width: '50px',
        height: '24px',
        background: checked ? '#1b9bd2' : '#e5e7eb',
        borderRadius: '14px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.3s ease',
        outline: 'none',
        opacity: disabled ? 0.5 : 1
    };

    const sliderStyle = {
        position: 'absolute',
        top: '3px',
        left: checked ? '29px' : '4px',
        width: '18px',
        height: '18px',
        background: 'white',
        borderRadius: '50%',
        transition: 'left 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    };

    const textStyle = {
        position: 'absolute',
        top: '50%',
        left: checked ? '6px' : '26px',
        transform: 'translateY(-50%)',
        fontSize: '9px',
        fontWeight: '600',
        color: checked ? 'white' : '#6b7280',
        userSelect: 'none',
        transition: 'all 0.3s ease'
    };

    return (
        <button
            style={toggleStyle}
            onClick={disabled ? undefined : onChange}
            disabled={disabled}
        >
            <div style={sliderStyle}></div>
            <span style={textStyle}>
                {checked ? 'ON' : 'OFF'}
            </span>
        </button>
    );
};

/**
 * 라디오 버튼 컴포넌트
 */
export const RadioButton = ({ options, value, onChange, name }) => {
    return (
        <div style={{ display: 'flex', gap: '16px' }}>
            {options.map((option) => (
                <label key={option.value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                }}>
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        onChange={(e) => onChange(e.target.value)}
                        style={{
                            width: '16px',
                            height: '16px',
                            accentColor: '#1b9bd2',
                            cursor: 'pointer'
                        }}
                    />
                    {option.label}
                </label>
            ))}
        </div>
    );
};

/**
 * 커스텀 셀렉트 컴포넌트
 */
export const CustomSelect = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    // value에 해당하는 label 찾기
    const selectedOption = options.find(option => option.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    return (
        <div style={{ position: 'relative' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    height: '44px',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <span>{displayText}</span>
                <span style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: '0.2s'
                }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    {options.map(option => (
                        <div
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f3f4f6',
                                hover: { background: '#f9fafb' }
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
                            onMouseLeave={(e) => e.target.style.background = 'white'}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
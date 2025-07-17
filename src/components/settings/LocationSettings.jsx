import React from 'react';
import { RadioButton } from '../UIComponents.jsx';
import { getCardStyle, getCardHeaderStyle } from '../../styles/commonStyles.jsx';

/**
 * 위치 설정 컴포넌트
 */
export const LocationSettings = ({ location = 'TOP', onChange }) => {
    return (
        <div style={getCardStyle(true)}>
            <div style={getCardHeaderStyle(true)}>
                <div>
                    <h4 style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#0e636e',
                        letterSpacing: '-0.5px'
                    }}>
                        위치 설정
                    </h4>
                    <p style={{
                        margin: '7px 0 0 0',
                        fontSize: '15px',
                        color: '#4a4e56',
                        fontWeight: 400,
                        opacity: 0.92
                    }}>
                        컨텐츠가 표시될 위치를 선택하세요
                    </p>
                </div>
            </div>
            <div style={{
                padding: '22px 18px 18px 18px',
                background: 'white',
                borderRadius: '0 0 18px 18px'
            }}>
                <RadioButton
                    options={[
                        { value: 'TOP', label: '상단(TOP)' },
                        { value: 'MID', label: '중앙(MIDDLE)' },
                        { value: 'BOT', label: '하단(BOTTOM)' }
                    ]}
                    value={location}
                    onChange={onChange}
                    name="location"
                />
            </div>
        </div>
    );
};
import React from 'react';
import { RadioButton } from '../UIComponents.jsx';

/**
 * 위치 설정 컴포넌트
 */
export const LocationSettings = ({ location, onChange }) => {
    return (
        <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            marginBottom: '24px',
        }}>
            <div style={{
                background: '#f5f9fc',
                padding: '16px 24px',
                borderBottom: '1px solid #e5e7eb',
                borderRadius: '12px 12px 0px 0px',
            }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>위치 설정</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                    컨텐츠가 표시될 위치를 선택하세요
                </p>
            </div>
            <div style={{ padding: '24px' }}>
                <RadioButton
                    options={[
                        { value: 'TOP', label: 'TOP' },
                        { value: 'MIDDLE', label: 'MIDDLE' },
                        { value: 'BOT', label: 'BOTTOM' }
                    ]}
                    value={location}
                    onChange={onChange}
                    name="location"
                />
            </div>
        </div>
    );
};
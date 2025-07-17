import React from 'react';
import { RadioButton } from '../UIComponents.jsx';

/**
 * 위치 설정 컴포넌트 - 카드 전체 동일 border, 헤더만 border-bottom 강조
 */
export const LocationSettings = ({ location = 'TOP', onChange }) => {
    return (
        <div
            style={{
                border: '1px solid rgba(22,157,175,0.20)', // 카드 전체 동일 보더!
                borderRadius: '18px',
                boxShadow: '0 1px 4px 0 rgba(22,157,175,0.18)',
                marginBottom: '32px',
                background: 'white',
                transition: 'box-shadow .18s cubic-bezier(.4,0,.2,1)'
            }}
        >
            <div
                style={{
                    background:
                        'linear-gradient(30deg, #e4f5fa 0%, #c0e6ef 0%, #fafdff 100%)',
                    padding: '20px 28px 14px 28px',
                    borderRadius: '18px 18px 0 0',
                    borderBottom: '1.5px solid #169DAF33', // 헤더 하단만 살짝 진하게
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                }}
            >
                <h4
                    style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#0e636e',
                        letterSpacing: '-0.5px'
                    }}
                >
                    위치 설정
                </h4>
                <p
                    style={{
                        margin: '7px 0 0 0',
                        fontSize: '15px',
                        color: '#4a4e56',
                        fontWeight: 400,
                        opacity: 0.92
                    }}
                >
                    컨텐츠가 표시될 위치를 선택하세요
                </p>
            </div>
            <div
                style={{
                    padding: '22px 18px 18px 18px',
                    background: 'white',
                    borderRadius: '0 0 18px 18px'
                }}
            >
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

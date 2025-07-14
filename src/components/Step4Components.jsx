import React from 'react';

/**
 * 이미지 설정 컴포넌트
 */
export const ImageSettings = () => {
    return (
        <div style={{ maxWidth: '600px' }}>
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>이미지 유형</label>
                <select
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white'
                    }}
                >
                    <option value="">이미지 유형을 선택하세요</option>
                    <option value="main">메인 이미지</option>
                    <option value="background">배경 이미지</option>
                    <option value="icon">아이콘</option>
                    <option value="banner">배너 이미지</option>
                </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>이미지 URL</label>
                <textarea
                    placeholder="이미지 URL을 입력하세요&#10;예: https://example.com/image.jpg"
                    style={{
                        width: '100%',
                        height: '100px',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                    }}
                />
            </div>

            <div style={{
                border: '2px dashed #d1d5db',
                padding: '40px 20px',
                borderRadius: '12px',
                background: '#f9fafb',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '16px' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.5 }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="9" cy="9" r="2" fill="currentColor"/>
                        <path d="M21 15l-3.09-3.09a2 2 0 00-2.83 0L9 18" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>
                    또는 파일을 드래그하여 업로드
                </p>
                <button
                    style={{
                        padding: '8px 16px',
                        background: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    파일 선택
                </button>
            </div>
        </div>
    );
};

/**
 * 텍스트 설정 컴포넌트
 */
export const TextSettings = () => {
    return (
        <div style={{ maxWidth: '600px' }}>
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>제목</label>
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                    }}
                />
            </div>
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>내용</label>
                <textarea
                    placeholder="내용을 입력하세요"
                    style={{
                        width: '100%',
                        height: '120px',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        resize: 'vertical'
                    }}
                />
            </div>
        </div>
    );
};

/**
 * 단일 버튼 설정 컴포넌트
 */
export const SingleButtonSettings = () => {
    return (
        <div style={{ maxWidth: '600px' }}>
            <div style={{
                border: '1px solid #e5e7eb',
                padding: '24px',
                borderRadius: '12px',
                marginBottom: '20px',
                background: 'white'
            }}>
                <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>버튼 설정</h4>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>버튼 텍스트</label>
                    <input
                        type="text"
                        placeholder="버튼 텍스트 입력"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>링크 URL</label>
                    <input
                        type="text"
                        placeholder="https://example.com"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

/**
 * 복수 버튼 설정 컴포넌트 (동적 버튼 추가 기능)
 */
export const MultipleButtonSettings = () => {
    const [buttons, setButtons] = React.useState([
        { id: 1, text: '', url: '' },
        { id: 2, text: '', url: '' }
    ]);

    const addButton = () => {
        const newButton = {
            id: buttons.length + 1,
            text: '',
            url: ''
        };
        setButtons([...buttons, newButton]);
        console.log('🔘 버튼 추가됨:', newButton);
    };

    const removeButton = (buttonId) => {
        if (buttons.length > 2) { // 최소 2개는 유지
            setButtons(buttons.filter(btn => btn.id !== buttonId));
            console.log('🗑️ 버튼 제거됨:', buttonId);
        }
    };

    const updateButton = (buttonId, field, value) => {
        setButtons(buttons.map(btn =>
            btn.id === buttonId ? { ...btn, [field]: value } : btn
        ));
    };

    return (
        <div style={{ maxWidth: '600px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                    버튼 설정 ({buttons.length}개)
                </h3>
                <button
                    onClick={addButton}
                    style={{
                        padding: '8px 16px',
                        background: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    + 버튼 추가
                </button>
            </div>

            {buttons.map((button, index) => (
                <div key={button.id} style={{
                    border: '1px solid #e5e7eb',
                    padding: '24px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    background: 'white',
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                            버튼 {index + 1}
                        </h4>
                        {buttons.length > 2 && (
                            <button
                                onClick={() => removeButton(button.id)}
                                style={{
                                    padding: '4px 8px',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                삭제
                            </button>
                        )}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>버튼 텍스트</label>
                        <input
                            type="text"
                            placeholder="버튼 텍스트 입력"
                            value={button.text}
                            onChange={(e) => updateButton(button.id, 'text', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>링크 URL</label>
                        <input
                            type="text"
                            placeholder="https://example.com"
                            value={button.url}
                            onChange={(e) => updateButton(button.id, 'url', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};
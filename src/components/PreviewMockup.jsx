import React from 'react';
export const PreviewMockup = () => (
    <>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>미리보기</h3>
        <Mockup>
            <PreviewFrame>
                <div>Preview Content</div>
            </PreviewFrame>
        </Mockup>
        <div style={{ marginTop: '20px' }}>
            <Button primary>JSON 정보</Button>
            <Button primary>스크립트 복사</Button>
        </div>
    </>
);
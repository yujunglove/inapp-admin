import React, { useRef, useEffect } from 'react';

/**
 * 실시간 미리보기 컴포넌트
 */
export const PreviewComponent = ({ data }) => {
    const iframeRef = useRef(null);

    // HTML 콘텐츠 생성
    const createPreviewHTML = () => {
        return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>InApp Preview</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
        }
        
        .preview-container {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .no-data {
            color: #6b7280;
            text-align: center;
        }
        
        .loading {
            color: #1f2937;
        }
    </style>
</head>
<body>
    <div class="preview-container">
        <div class="no-data">설정을 완료하면 미리보기가 표시됩니다</div>
    </div>
    
    <script src="https://quadmax.co.kr/qdx/qdx-renderer.js"></script>
    <script>
        // qdx 초기화
        qdx.init({
            "api_key": "8jaAWd0Zp7POcZYLWDBdCg==",
            "cntnrId": "easycore",
            "serverUrl": "https://quadmax.co.kr"
        });

        // 메시지 수신 이벤트
        window.addEventListener('message', function (e) {
            if(document.getElementById('qdx_popup_wrap')){
                document.getElementById('qdx_popup_wrap').remove();       
            }
            
            if (e.data.inapp) {
                console.log('인앱 메시지 표시:', e.data.inapp);
                qdx.showMsg('PREVIEW', e.data.inapp);
            }
        });
        
        // 준비 완료 알림
        window.parent.postMessage({ ready: true }, '*');
    </script>
</body>
</html>`;
    };

    // 데이터가 변경될 때마다 iframe에 메시지 전송
    useEffect(() => {
        if (data && iframeRef.current) {
            console.log('미리보기 데이터 전송:', data);
            // iframe이 로드된 후 메시지 전송
            const sendMessage = () => {
                if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage({
                        inapp: data
                    }, '*');
                }
            };
        }
    }, [data]);

    // iframe 로드 완료 핸들러
    const handleIframeLoad = () => {
        console.log('미리보기 iframe 로드 완료');

        // 데이터가 있으면 즉시 전송
        if (data && iframeRef.current?.contentWindow) {
            setTimeout(() => {
                iframeRef.current.contentWindow.postMessage({
                    inapp: data
                }, '*');
            }, 500); // qdx 초기화 대기
        }
    };

    return (
        <div style={{
            width: '100%',
            height: '500px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'white'
        }}>
            <iframe
                ref={iframeRef}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none'
                }}
                srcDoc={createPreviewHTML()}
                onLoad={handleIframeLoad}
                title="InApp Preview"
            />
        </div>
    );
};
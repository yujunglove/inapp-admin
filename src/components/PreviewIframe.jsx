import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const IFRAME_CONTENT = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>QDX Preview</title>
    <link rel="stylesheet" href="https://quadmax.co.kr/qdx/css/qdx_popup.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&family=Nanum+Myeongjo:wght@400;700;800&family=Nanum+Pen+Script&family=Nanum+Brush+Script&display=swap" rel="stylesheet">
    <style>
        /* 기본 CSS 오버라이드 - Pretendard 폰트 강제 적용 해제 */
        #qdx_popup_wrap * {
            font-family: inherit !important;
        }
        
        /* 텍스트 요소의 폰트 스타일 강제 적용 */
        .qdx_text h2 *, .qdx_text p *, .qdx_text .qdx_text_content *, 
        .qdx_text h2, .qdx_text p, .qdx_text .qdx_text_content {
            font-family: inherit !important;
        }
        
        /* 특정 폰트 클래스 강제 적용 */
        [style*="Nanum Gothic"] *, [style*="Nanum Gothic"] {
            font-family: 'Nanum Gothic', sans-serif !important;
        }
        
        [style*="Nanum Myeongjo"] *, [style*="Nanum Myeongjo"] {
            font-family: 'Nanum Myeongjo', serif !important;
        }
        
        [style*="Nanum Pen Script"] *, [style*="Nanum Pen Script"] {
            font-family: 'Nanum Pen Script', cursive !important;
        }
        
        [style*="Nanum Brush Script"] *, [style*="Nanum Brush Script"] {
            font-family: 'Nanum Brush Script', cursive !important;
        }
        
        /* 모든 텍스트 요소에 사용자 설정 폰트 적용 */
        .qdx_text span[style*="font-family"] {
            font-family: inherit !important;
        }
        
        /* 기본 폰트 설정 */
        .qdx_text {
            font-family: 'Nanum Gothic', sans-serif !important;
        }
        
        /* 동적으로 적용되는 폰트 스타일 우선순위 보장 */
        .qdx_text [style] {
            font-family: inherit !important;
        }
    </style>
</head>
<body>
    <script>
        let localQdx = null;
        let qdxReady = false;
        let pendingPreview = null;
        
        function initLocalQdx() {
            // QdxRenderer를 인라인으로 정의
            window.QdxRenderer = {
                showMsg: (id, data) => {
                    window.parent.postMessage({
                        type: 'generate_popup_html',
                        messageId: id,
                        data: data
                    }, '*');
                }
            };
            
            localQdx = window.QdxRenderer;
            qdxReady = true;
            
            // 초기화 완료 알림
            window.parent.postMessage({
                type: 'iframe_ready'
            }, '*');
            
            if (pendingPreview) {
                showPreview(pendingPreview);
                pendingPreview = null;
            }
        }
        
        function initSwiper(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            if (!window.Swiper) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
                script.onload = () => {
                    const css = document.createElement('link');
                    css.rel = 'stylesheet';
                    css.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
                    document.head.appendChild(css);
                    
                    setTimeout(() => {
                        createSwiper(containerId);
                    }, 100);
                };
                document.head.appendChild(script);
            } else {
                createSwiper(containerId);
            }
        }

        function createSwiper(containerId) {
            const swiper = new window.Swiper(\`#\${containerId}\`, {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: false,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                navigation: {
                    nextEl: \`#\${containerId} .swiper-button-next\`,
                    prevEl: \`#\${containerId} .swiper-button-prev\`,
                },
                pagination: {
                    el: \`#\${containerId} .swiper-pagination\`,
                    type: 'custom',
                    renderCustom: function (swiper, current, total) {
                        return \`<span class="swiper-pagination-current">\${current}</span> / <span class="swiper-pagination-total">\${total}</span>\`;
                    }
                }
            });
            
            return swiper;
        }
        
        function showPreview(data) {
            if (!qdxReady || !localQdx) {
                pendingPreview = data;
                return;
            }
            localQdx.showMsg('TEST_' + Date.now(), data);
        }
        
        window.addEventListener('message', (e) => {
            if (e.data.type === 'show_preview') {
                showPreview(e.data.data);
            } else if (e.data.type === 'popup_html_generated') {
                document.getElementById('qdx_popup_wrap')?.remove();
                document.body.insertAdjacentHTML('beforeend', e.data.html);
                adjustPreviewPosition();
                
                setTimeout(() => {
                    const popup = document.getElementById('qdx_popup_wrap');
                    if (popup) {
                        applyFontStyles(popup);
                        
                        // zoom 재적용 (텍스트 토글 시에도 유지)
                        const popupBox = popup.querySelector('.qdx_popup_box');
                        if (popupBox) {
                            popupBox.style.zoom = '0.9';
                        }
                        
                        const slideElement = popup.querySelector('#qdx_slide');
                        if (slideElement) {
                            setTimeout(() => {
                                initSwiper('qdx_slide');
                            }, 200);
                        }
                    }
                }, 100);
                
                const todayCheckbox = document.querySelector('input[name="today"]');
                if (todayCheckbox) {
                    todayCheckbox.addEventListener('change', (event) => {
                        window.parent.postMessage({
                            type: 'today_option_changed',
                            checked: event.target.checked
                        }, '*');
                    });
                }
            }
        });
        
        function adjustPreviewPosition() {
            const popup = document.getElementById('qdx_popup_wrap');
            if (!popup) return;
            
            popup.style.background = '#fafafa';
            applyFontStyles(popup);
            
            // 전체 팝업 박스에 고정 zoom 적용
            const popupBox = popup.querySelector('.qdx_popup_box');
            if (popupBox) {
               popupBox.style.zoom = '0.9';  // 0.9로 조정
            }
            
            const contElement = popup.querySelector('.qdx_cont');
            if (contElement) {
                contElement.style.boxShadow = 'rgba(0, 0, 0, 0.2) 8px 8px 24px 8px';
                contElement.style.transform = 'none';
            }
        }
        
        function applyFontStyles(container) {
            const textContainers = container.querySelectorAll('.qdx_text');
            
            textContainers.forEach((textContainer) => {
                const allElements = textContainer.querySelectorAll('*');
                allElements.forEach((element) => {
                    const style = element.getAttribute('style');
                    if (style) {
                        const styleDeclarations = style.split(';').filter(decl => decl.trim());
                        styleDeclarations.forEach(declaration => {
                            const [property, value] = declaration.split(':').map(s => s.trim());
                            if (property && value) {
                                // 폰트 패밀리는 특히 강제로 적용
                                if (property === 'font-family') {
                                    element.style.setProperty(property, value, 'important');
                                } else {
                                    element.style.setProperty(property, value, 'important');
                                }
                            }
                        });
                    }
                });
            });
        }
        
        function selectStar(score) {
            document.querySelectorAll('.qdx_startImg').forEach(star => {
                star.classList.remove('qdx_on');
            });
            
            for (let i = 1; i <= score; i++) {
                const star = document.querySelector(\`.qdx_startImg[data-score="\${i}"]\`);
                if (star) {
                    star.classList.add('qdx_on');
                }
            }
        }
        
        window.selectStar = selectStar;
        
        // 버튼 클릭 핸들러 추가
        window.handleButtonClick = function(event, url, target) {
            // 빈 URL이나 # 만 있는 경우 기본 동작 방지
            if (!url || url === '#' || url.startsWith('#')) {
                event.preventDefault();
                console.log('Empty or hash-only URL, preventing navigation');
                return false;
            }
            
            // 정상적인 URL인 경우
            if (url.startsWith('http://') || url.startsWith('https://')) {
                // target에 따라 처리
                if (target === '_blank') {
                    window.open(url, '_blank');
                } else {
                    window.location.href = url;
                }
                event.preventDefault();
                return false;
            }
            
            // 상대 경로인 경우 기본 동작 방지
            event.preventDefault();
            console.log('Relative URL detected, preventing navigation:', url);
            return false;
        };
        
        // 이미지 클릭 핸들러 추가
        window.handleImageClick = function(event, url, target) {
            // 버튼 클릭과 동일한 로직 적용
            return window.handleButtonClick(event, url, target);
        };
        
        initLocalQdx();
    </script>
</body>
</html>
`;

const PreviewIframe = forwardRef(({ onMessage }, ref) => {
    const iframeRef = useRef(null);

    useImperativeHandle(ref, () => ({
        postMessage: (data) => {
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(data, '*');
            }
        }
    }));

    useEffect(() => {
        const handleMessage = (e) => {
            if (onMessage) {
                onMessage(e);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onMessage]);

    const handleLoad = () => {
        if (iframeRef.current?.contentWindow) {
            // 초기 로드 시 메시지 전송이 필요한 경우 여기서 처리
        }
    };

    return (
        <iframe
            ref={iframeRef}
            onLoad={handleLoad}
            style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: 'transparent',
                minHeight: '400px'
            }}
            srcDoc={IFRAME_CONTENT}
            title="QDX Preview"
            sandbox="allow-scripts allow-same-origin allow-popups"
        />
    );
});

PreviewIframe.displayName = 'PreviewIframe';

export default PreviewIframe;
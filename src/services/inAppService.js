// services/inAppService.js

/**
 * qdx CDN 기반 InApp 서비스
 */
export class InAppService {

    static config = {
        api_key: "8jaAWd0Zp7POcZYLWDBdCg==",
        cntnrId: "easycore",
        serverUrl: "https://quadmax.co.kr",
        scriptUrl: "https://quadmax.co.kr/qdx/qdx-renderer.js"
    };

    static isInitialized = false;

    /**
     * qdx 라이브러리 로드 및 초기화
     */
    static async loadQdx() {
        return new Promise((resolve, reject) => {
            // 이미 로드되었는지 확인
            if (window.qdx) {
                this.isInitialized = true;
                resolve(window.qdx);
                return;
            }

            // 스크립트 태그 생성
            const script = document.createElement('script');
            script.src = this.config.scriptUrl;
            script.async = true;

            script.onload = () => {
                try {
                    // qdx 초기화
                    window.qdx.init({
                        api_key: this.config.api_key,
                        cntnrId: this.config.cntnrId,
                        serverUrl: this.config.serverUrl
                    });

                    this.isInitialized = true;
                    console.log('✅ qdx 라이브러리 로드 및 초기화 완료');
                    resolve(window.qdx);
                } catch (error) {
                    console.error('❌ qdx 초기화 실패:', error);
                    reject(error);
                }
            };

            script.onerror = () => {
                const error = new Error('qdx 스크립트 로드 실패');
                console.error('❌', error);
                reject(error);
            };

            document.head.appendChild(script);
        });
    }

    /**
     * qdx 객체가 사용 가능한지 확인
     */
    static async ensureQdxReady() {
        if (!this.isInitialized || !window.qdx) {
            await this.loadQdx();
        }
        return window.qdx;
    }

    /**
     * 인앱 메시지 표시
     * @param {string} id - 메시지 ID
     * @param {Object} data - 인앱 메시지 데이터
     */
    static async showMessage(id, data) {
        try {
            const qdx = await this.ensureQdxReady();

            // 기존 팝업 제거
            const existingPopup = document.getElementById('qdx_popup_wrap');
            if (existingPopup) {
                existingPopup.remove();
            }

            // 인앱 메시지 표시
            qdx.showMsg(id, data);
            console.log('✅ 인앱 메시지 표시 성공:', { id, data });

            return true;
        } catch (error) {
            console.error('❌ 인앱 메시지 표시 실패:', error);

            // 에러 발생 시 JSON 팝업으로 대체
            this.showJsonPopup(data);
            return false;
        }
    }

    /**
     * JSON 데이터를 팝업으로 표시 (대체 수단)
     */
    static showJsonPopup(data) {
        const jsonString = JSON.stringify(data, null, 2);
        const popup = window.open('', '_blank', 'width=700,height=800,scrollbars=yes');

        if (popup) {
            popup.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>InApp JSON 데이터</title>
                    <style>
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            padding: 20px;
                            margin: 0;
                            background: #f5f5f5;
                        }
                        .container {
                            background: white;
                            padding: 24px;
                            border-radius: 8px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        h1 { 
                            color: #1f2937; 
                            margin-top: 0; 
                        }
                        pre { 
                            background: #f8fafc; 
                            padding: 16px; 
                            border-radius: 6px; 
                            overflow: auto;
                            border: 1px solid #e2e8f0;
                            font-size: 14px;
                            line-height: 1.5;
                        }
                        .btn {
                            background: #3b82f6;
                            color: white;
                            border: none;
                            padding: 10px 16px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                            margin-right: 8px;
                        }
                        .btn:hover {
                            background: #2563eb;
                        }
                        .alert {
                            background: #fef3c7;
                            border: 1px solid #f59e0b;
                            color: #92400e;
                            padding: 12px;
                            border-radius: 6px;
                            margin-bottom: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="alert">
                            ⚠️ qdx 라이브러리를 사용할 수 없어 JSON 데이터를 표시합니다.
                        </div>
                        <h1>InApp JSON 데이터</h1>
                        <pre id="jsonData">${jsonString}</pre>
                        <button class="btn" onclick="copyToClipboard()">📋 클립보드에 복사</button>
                        <button class="btn" onclick="window.close()">❌ 닫기</button>
                    </div>
                    <script>
                        function copyToClipboard() {
                            const text = document.getElementById('jsonData').textContent;
                            navigator.clipboard.writeText(text).then(() => {
                                alert('클립보드에 복사되었습니다!');
                            }).catch(() => {
                                // 구형 브라우저 대응
                                const textArea = document.createElement('textarea');
                                textArea.value = text;
                                document.body.appendChild(textArea);
                                textArea.select();
                                document.execCommand('copy');
                                document.body.removeChild(textArea);
                                alert('클립보드에 복사되었습니다!');
                            });
                        }
                    </script>
                </body>
                </html>
            `);
        } else {
            // 팝업 차단된 경우 콘솔에 출력
            console.log('📄 InApp JSON 데이터:', data);
            alert('팝업이 차단되었습니다. 콘솔을 확인해주세요.');
        }
    }

    /**
     * 테스트용 메시지 표시
     */
    static async showTestMessage(data) {
        return this.showMessage('TEST', data);
    }

    /**
     * 프리뷰용 메시지 표시
     */
    static async showPreview(data) {
        return this.showMessage('PREVIEW', data);
    }

    /**
     * 설정 변경
     */
    static updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.isInitialized = false; // 재초기화 필요
    }
}
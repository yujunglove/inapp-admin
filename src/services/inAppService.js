export class InAppService {

    static config = {
        api_key: "8jaAWd0Zp7POcZYLWDBdCg==",
        cntnrId: "easycore",
        serverUrl: "https://quadmax.co.kr",
        scriptPath: "./src/assets/qdx-renderer.js.umd.cjs"
    };

    static isInitialized = false;

    static async loadQdx() {
        return new Promise((resolve, reject) => {
            if (window.qdx) {
                this.isInitialized = true;
                resolve(window.qdx);
                return;
            }

            const possiblePaths = [
                './src/assets/qdx-renderer.js.umd.cjs',
                '/src/assets/qdx-renderer.js.umd.cjs',
                '../src/assets/qdx-renderer.js.umd.cjs',
                './assets/qdx-renderer.js.umd.cjs',
                '/assets/qdx-renderer.js.umd.cjs',
                './public/assets/qdx-renderer.js.umd.cjs',
                '/public/assets/qdx-renderer.js.umd.cjs',
                `${window.location.origin}/src/assets/qdx-renderer.js.umd.cjs`
            ];

            const tryLoadPath = (pathIndex) => {
                if (pathIndex >= possiblePaths.length) {
                    const error = new Error('모든 경로에서 로컬 qdx-renderer.js.umd.cjs 파일 로드 실패');
                    reject(error);
                    return;
                }

                const currentPath = possiblePaths[pathIndex];
                const script = document.createElement('script');
                script.src = currentPath;
                script.async = true;

                script.onload = () => {
                    try {
                        if (window.qdx && typeof window.qdx.init === 'function') {
                            window.qdx.init({
                                api_key: this.config.api_key,
                                cntnrId: this.config.cntnrId,
                                serverUrl: this.config.serverUrl
                            });

                            this.isInitialized = true;
                            resolve(window.qdx);
                        } else {
                            throw new Error('qdx 객체가 로드되지 않았습니다.');
                        }
                    } catch (error) {
                        reject(error);
                    }
                };

                script.onerror = () => {
                    setTimeout(() => tryLoadPath(pathIndex + 1), 100);
                };

                document.head.appendChild(script);
            };

            tryLoadPath(0);
        });
    }

    static async ensureQdxReady() {
        if (!this.isInitialized || !window.qdx) {
            await this.loadQdx();
        }
        return window.qdx;
    }

    static async showMessage(id, data) {
        try {
            const qdx = await this.ensureQdxReady();

            const existingPopup = document.getElementById('qdx_popup_wrap');
            if (existingPopup) {
                existingPopup.remove();
            }

            if (!data.display || !data.theme || !Array.isArray(data.show)) {
                throw new Error('유효하지 않은 데이터 형식입니다.');
            }

            if (qdx.showMsg) {
                qdx.showMsg(id, data);
            } else if (qdx.init && typeof qdx.init === 'function') {
                qdx.showMsg(id, data);
            } else {
                throw new Error('showMsg 메서드를 찾을 수 없습니다.');
            }

            return true;
        } catch (error) {
            this.showJsonPopup(data);
            return false;
        }
    }

    static showJsonPopup(data) {
        const jsonString = JSON.stringify(data, null, 2);
        const popup = window.open('', '_blank', 'width=700,height=800,scrollbars=yes');

        if (popup) {
            popup.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>InApp JSON 데이터 (새로운 형식)</title>
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
                        .format-info {
                            background: #dbeafe;
                            border: 1px solid #3b82f6;
                            color: #1e40af;
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
                        <div class="format-info">
                            ℹ️ 새로운 형식: template과 theme이 통합되었고, show 배열로 표시 컴포넌트를 관리합니다.
                        </div>
                        <h1>InApp JSON 데이터 (새로운 형식)</h1>
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
            alert('팝업이 차단되었습니다. 콘솔을 확인해주세요.');
        }
    }

    static async showTestMessage(data) {
        return this.showMessage('TEST', data);
    }

    static async showPreview(data) {
        return this.showMessage('PREVIEW', data);
    }

    static updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.isInitialized = false;
    }
}
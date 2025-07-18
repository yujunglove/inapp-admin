// utils/previewTemplate.js - 안전한 문자열 연결 방식

export const createPreviewTemplate = () => {
    return [
        '<!DOCTYPE html>',
        '<html lang="ko">',
        '<head>',
        '    <meta charset="UTF-8">',
        '    <title>QDX Preview</title>',
        '    <style>',
        '        * { margin: 0; padding: 0; box-sizing: border-box; }',
        '        html, body {',
        '            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
        '            background: transparent !important;',
        '            width: 100%;',
        '            height: 100vh;',
        '            overflow: hidden;',
        '            position: relative;',
        '        }',
        '        #qdx_popup_wrap {',
        '            background: transparent !important;',
        '            position: static !important;',
        '            width: 100% !important;',
        '            height: 100% !important;',
        '            display: flex !important;',
        '            align-items: center !important;',
        '            justify-content: center !important;',
        '        }',
        '        .qdx_popup {',
        '            position: static !important;',
        '            transform: none !important;',
        '            max-width: none !important;',
        '            max-height: none !important;',
        '            width: auto !important;',
        '            height: auto !important;',
        '            margin: 0 !important;',
        '            background: transparent !important;',
        '        }',
        '        .qdx_popup > div {',
        '            border-radius: 12px !important;',
        '            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;',
        '            overflow: hidden !important;',
        '            max-width: 400px !important;',
        '            background: white !important;',
        '        }',
        '        .qdx_cont {',
        '            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;',
        '        }',
        '    </style>',
        '</head>',
        '<body>',
        '    <script src="https://quadmax.co.kr/qdx/qdx-renderer.js"></script>',
        '    <script>',
        '        let qdxReady = false;',
        '        function initQdx() {',
        '            try {',
        '                if (window.qdx && typeof window.qdx.init === "function") {',
        '                    qdx.init({',
        '                        api_key: "8jaAWd0Zp7POcZYLWDBdCg==",',
        '                        cntnrId: "easycore",',
        '                        serverUrl: "https://quadmax.co.kr"',
        '                    });',
        '                    qdxReady = true;',
        '                    console.log("QDX 초기화 성공");',
        '                } else {',
        '                    setTimeout(initQdx, 1000);',
        '                }',
        '            } catch (error) {',
        '                console.error("QDX 초기화 실패:", error);',
        '                setTimeout(initQdx, 2000);',
        '            }',
        '        }',
        '        function showPreview(data) {',
        '            if (!qdxReady || !data) return;',
        '            try {',
        '                const existingPopup = document.getElementById("qdx_popup_wrap");',
        '                if (existingPopup) existingPopup.remove();',
        '                const messageId = "PREVIEW_" + Date.now();',
        '                qdx.showMsg(messageId, data);',
        '            } catch (error) {',
        '                console.error("미리보기 실패:", error);',
        '                try {',
        '                    const fallbackData = {',
        '                        display: "BAR",',
        '                        theme: "T3",',
        '                        template: "M3",',
        '                        location: "TOP",',
        '                        images: [{',
        '                            seq: 1,',
        '                            url: "https://attach.lolchess.gg/2023%2F06%2F29%2F1688008689303-C1C5791E-65F2-47E3-AC0A-156C894B3A31.jpeg",',
        '                            action: "",',
        '                            linkUrl: "",',
        '                            linkOpt: ""',
        '                        }],',
        '                        msg: {',
        '                            title: data.msg?.title || "미리보기 제목",',
        '                            text: data.msg?.text || "미리보기 내용"',
        '                        },',
        '                        today: "N",',
        '                        buttons: []',
        '                    };',
        '                    const fallbackId = "FALLBACK_" + Date.now();',
        '                    qdx.showMsg(fallbackId, fallbackData);',
        '                } catch (fallbackError) {',
        '                    console.error("패턴 2도 실패:", fallbackError);',
        '                }',
        '            }',
        '        }',
        '        window.addEventListener("message", function (e) {',
        '            if (e.data.type === "show_preview" && e.data.data) {',
        '                showPreview(e.data.data);',
        '            }',
        '        });',
        '        setTimeout(initQdx, 100);',
        '        setInterval(() => {',
        '            if (!qdxReady && window.qdx) initQdx();',
        '        }, 3000);',
        '    </script>',
        '</body>',
        '</html>'
    ].join('\n');
};
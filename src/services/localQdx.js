import { generatePopupHTML } from '../components/popupGenerator.js';

export class LocalQdxManager {
    constructor() {
        this.localQdx = null;
        this.qdxReady = false;
        this.pendingPreview = null;
    }

    async init() {
        try {
            const script = document.createElement('script');
            script.src = '../src/assets/qdx-renderer.js.umd.cjs';

            script.onload = () => {
                setTimeout(() => {
                    if (window.QdxRenderer) {
                        this.localQdx = window.QdxRenderer;
                        this.overrideShowMsg();
                        this.qdxReady = true;

                        if (this.pendingPreview) {
                            this.showPreview(this.pendingPreview);
                            this.pendingPreview = null;
                        }
                    }
                }, 100);
            };

            script.onerror = () => {
                console.error('❌ 로컬 스크립트 로드 실패');
            };

            document.head.appendChild(script);

        } catch (error) {
            console.error('❌ 로컬 QDX 초기화 실패:', error);
        }
    }

    overrideShowMsg() {
        if (this.localQdx && this.localQdx.showMsg) {
            const originalShowMsg = this.localQdx.showMsg;
            this.localQdx.showMsg = (messageId, data) => {
                this.createLocalPopup(messageId, data);
            };
        }
    }

    createLocalPopup(messageId, data) {
        const existingPopup = document.getElementById('qdx_popup_wrap');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popupHtml = generatePopupHTML(messageId, data);
        document.body.insertAdjacentHTML('beforeend', popupHtml);
    }

    showPreview(data) {
        if (!data) {
            return;
        }

        if (!this.qdxReady || !this.localQdx) {
            this.pendingPreview = data;
            return;
        }

        try {
            const cleanData = {
                display: data.display,
                theme: data.theme,
                template: data.template,
                location: data.location,
                images: data.images || [],
                msg: data.msg || {},
                today: data.today || 'N',
                buttons: data.buttons || []
            };

            const messageId = 'TEST_' + Date.now();
            this.localQdx.showMsg(messageId, cleanData);

        } catch (error) {
            console.error('❌ 로컬 미리보기 실패:', error);
        }
    }
}
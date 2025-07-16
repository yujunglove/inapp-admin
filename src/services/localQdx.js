// localQdx.js - 로컬 QDX 초기화 및 관리
import { generatePopupHTML } from '../components/popupGenerator.js';

export class LocalQdxManager {
    constructor() {
        this.localQdx = null;
        this.qdxReady = false;
        this.pendingPreview = null;
    }

    async init() {
        try {
            // 로컬 스크립트 로드
            const script = document.createElement('script');
            script.src = '../src/assets/qdx-renderer.js.umd.cjs';

            script.onload = () => {
                console.log('🔄 로컬 QDX 로드 완료');

                setTimeout(() => {
                    if (window.QdxRenderer) {
                        console.log('🎯 로컬 QdxRenderer 발견:', window.QdxRenderer);
                        this.localQdx = window.QdxRenderer;

                        // 서버 전송 방지: showMsg 함수 오버라이드
                        this.overrideShowMsg();

                        this.qdxReady = true;
                        console.log('✅ 로컬 QDX 준비 완료 (서버 전송 방지)');

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
                console.log('🚫 서버 전송 방지: showMsg 호출 차단');
                console.log('📱 대신 로컬 렌더링 수행:', data);

                // 팝업 구조만 생성하고 서버 전송은 하지 않음
                this.createLocalPopup(messageId, data);
            };
        }
    }

    createLocalPopup(messageId, data) {
        // 기존 팝업 제거
        const existingPopup = document.getElementById('qdx_popup_wrap');
        if (existingPopup) {
            existingPopup.remove();
        }

        // 팝업 HTML 생성
        const popupHtml = generatePopupHTML(messageId, data);
        document.body.insertAdjacentHTML('beforeend', popupHtml);

        console.log('✅ 로컬 팝업 생성 완료');
    }

    showPreview(data) {
        if (!data) {
            console.log('데이터 없음');
            return;
        }

        if (!this.qdxReady || !this.localQdx) {
            console.log('⏳ 로컬 QDX 준비 중... 미리보기 대기');
            this.pendingPreview = data;
            return;
        }

        try {
            // template/theme 필드 제거하고 DB 매핑에 맞는 순수 데이터만 전송
            const cleanData = {
                display: data.display,
                theme: data.theme, // DB 매핑용
                template: data.template, // DB 매핑용
                location: data.location,
                images: data.images || [],
                msg: data.msg || {},
                today: data.today || 'N',
                buttons: data.buttons || []
            };

            console.log('📱 로컬 JS + CDN CSS 미리보기 표시:', cleanData);

            const messageId = 'TEST_' + Date.now();
            this.localQdx.showMsg(messageId, cleanData);

        } catch (error) {
            console.error('❌ 로컬 미리보기 실패:', error);
        }
    }
}
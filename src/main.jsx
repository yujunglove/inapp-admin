import { render } from './app.jsx';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles/swiper-custom.css';

// showMsg 함수 정의
function showMsg(containerId, config = {}, callbacks = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return;
    }

    // React 컴포넌트를 렌더링하는 함수 호출
    render(containerId, config, callbacks);
}

// window.qdxInapp 객체로 노출
window.qdxInapp = {
    showMsg: showMsg
};

// UMD 빌드를 위한 export
export { showMsg };

// 개발 환경에서 자동 실행 (옵션)
if (import.meta.env.DEV) {
    render('root');
}
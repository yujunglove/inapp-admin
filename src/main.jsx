import { render } from './app.jsx';

// 전역 객체로 export
window.QdxInapp = { render };

// 모듈로도 export
export { render };

render('root');